import type { ActionFunction, UploadHandler } from "@remix-run/node";
import type { FileObject } from "@supabase/storage-js";
import {
  json,
  LoaderFunction,
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
} from "@remix-run/node";
import { writeAsyncIterableToWritable } from "@remix-run/node";
import { requireAuthSession } from "~/modules/auth/guards";
import { AuthSession } from "~/modules/auth/session.server";
import { getSupabaseAdmin } from "~/integrations/supabase"; // TODO: downgrade to client after prototype
import { Link, Form, useLoaderData, useActionData } from "@remix-run/react";
import { createFileUploadHandler } from "@remix-run/node/dist/upload/fileUploadHandler";

async function uploadPdfToSupabase(fileSrc: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage
    .from("moto-public")
    .upload(`sales-sheets/test-file.pdf`, fileSrc, {
      cacheControl: "3600",
      upsert: false,
    });
  console.log(data, error);
}

type LoaderData = {
  authSession: AuthSession;
  data: FileObject[];
};

type ActionData = {
  errorMsg?: string;
  fileSrc?: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const authSession = await requireAuthSession(request);
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage
    .from("moto-public")
    .list("sales-sheets", {
      limit: 100,
      offset: 0,
      sortBy: { column: "created_at", order: "desc" },
    });
  console.log(data, error);

  return json({ authSession, data, error }, { status: error ? 500 : 200 });
};

export const action: ActionFunction = async ({ request }) => {
  const uploadHandler = composeUploadHandlers(
    createFileUploadHandler({
      maxPartSize: 5_000_000,
      file: ({ filename }) => filename,
    }),
    createMemoryUploadHandler()
  );

  const formData = await parseMultipartFormData(request, uploadHandler);
  //   const fileSrc = formData.get("file-field");

  const uploadedFile = await uploadPdfToSupabase("fileSrc");

  return null;
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
        {actionData?.fileSrc && (
          <>
            <h2>uploaded file</h2>
            <p>{actionData.fileSrc}</p>
          </>
        )}
      </div>
    </>
  );
}
