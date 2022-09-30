import type { ActionFunction, UploadHandler } from "@remix-run/node";
import type { FileObject } from "@supabase/storage-js";
import {
  json,
  LoaderFunction,
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
  unstable_createFileUploadHandler as createFileUploadHandler,
} from "@remix-run/node";
import { requireAuthSession } from "~/modules/auth/guards";
import { AuthSession } from "~/modules/auth/session.server";
import { getSupabase } from "~/integrations/supabase";
import { Link, Form, useLoaderData, useActionData } from "@remix-run/react";

type LoaderData = {
  authSession: AuthSession;
  data: FileObject[];
};

type ActionData = {
  errorMsg?: string;
  fileName?: string;
};

const asyncIterableToStream = (asyncIterable: AsyncIterable<Uint8Array>) => {
  return new ReadableStream({
    async pull(controller) {
      for await (const entry of asyncIterable) {
        controller.enqueue(entry);
      }
      controller.close();
    },
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  const authSession = await requireAuthSession(request);
  const supabase = getSupabase(authSession.accessToken);
  const { data, error } = await supabase.storage
    .from("moto-public")
    .list("sales-sheets", {
      limit: 100,
      offset: 0,
      sortBy: { column: "created_at", order: "desc" },
    });
  console.log(data, error);

  return json(
    { authSession, data, error, supabase },
    { status: error ? 500 : 200 }
  );
};

export const action: ActionFunction = async ({ request }) => {
  const authSession = await requireAuthSession(request);
  const supabase = getSupabase(authSession.accessToken);

  const uploadHandler = composeUploadHandlers(async (file) => {
    if (file.name !== "fileSrc") {
      return undefined;
    }

    const stream = asyncIterableToStream(file.data);

    const { data, error } = await supabase.storage
      .from("moto-public")
      .upload(`sales-sheets/${file.filename}`, stream, {
        contentType: file.contentType,
        upsert: false,
      });

    if (error) {
      throw error;
    }

    return JSON.stringify({ data });
  }, createMemoryUploadHandler());

  const formData = await parseMultipartFormData(request, uploadHandler);
  const fileSrc = formData.get("fileSrc");
  // if (!fileSrc || typeof fileSrc === "string") {
  //   return json({
  //     error: "something wrong",
  //   });
  // }

  // // const uploadedFile = await uploadPdfToSupabase(fileSrc);

  return json({ fileName: fileSrc }, { status: 200 });
};

export default function SalesSheetsIndex(): JSX.Element {
  const data = useLoaderData<LoaderData>();
  const { authSession, data: files } = data;
  const actionData = useActionData<ActionData>();

  return (
    <>
      <div>
        <h1>Sales Sheets</h1>
      </div>
      {/* <div>
        <h3>{JSON.stringify(files)}</h3>
      </div> */}
      <div>
        <ul>
          {files.map((file) => (
            <div key={file.name}>
              <Link to={file.name}>{file.name}</Link>
            </div>
          ))}
        </ul>
      </div>
      <div>
        <Form
          method="post"
          encType="multipart/form-data"
        >
          <label htmlFor="file-field">File to upload</label>
          <input
            id="file-field"
            type="file"
            name="fileSrc"
            accept=".pdf"
          />
          <button type="submit">Upload</button>
        </Form>
        {actionData?.errorMsg && <h2>{actionData?.errorMsg}</h2>}
        {actionData?.fileName && (
          <>
            <h2>uploaded file</h2>
            <p>{actionData?.fileName}</p>
          </>
        )}
      </div>
    </>
  );
}
