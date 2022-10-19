import { ChevronRightIcon } from "@heroicons/react/24/outline";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import {
  json,
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
} from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import type { FileObject } from "@supabase/storage-js";
import dayjs from "dayjs";
import slugify from "slugify";
import invariant from "tiny-invariant";

import { getSupabase } from "~/integrations/supabase";
import { requireAuthSession } from "~/modules/auth/guards";
import type { AuthSession } from "~/modules/auth/session.server";

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
  // console.log(data, error);

  return json(
    { authSession, data, error, supabase },
    { status: error ? 500 : 200 }
  );
};

export const action: ActionFunction = async ({ request }) => {
  const authSession = await requireAuthSession(request);

  const uploadHandler = composeUploadHandlers(async (file) => {
    invariant(file, "There is no file to upload.");

    if (file.name !== "fileSrc") {
      return;
    }

    const stream = asyncIterableToStream(file.data);
    const urlSafeFilename = slugify(file.filename as string, {
      remove: /"<>#%{}\|\\\^~\[]`;\?:@=&/g,
    });

    const { data, error } = await getSupabase(authSession.accessToken)
      .storage.from("moto-public")
      .upload(`sales-sheets/${urlSafeFilename}`, stream, {
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

  return json({ fileName: fileSrc }, { status: 200 });
};

export default function SalesSheetsIndex(): JSX.Element {
  const { authSession, data: files } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();

  return (
    <>
      <div>
        <h1>Sales Sheets</h1>
      </div>
      {/* <div>
        <h3>{JSON.stringify(files)}</h3>
      </div> */}
      <div className="overflow-hidden bg-white shadow sm:rounded-md">
        <ul
          role="list"
          className="divide-y divide-gray-200"
        >
          {files.map((file) => (
            <li key={file.name}>
              <Link
                to={file.name}
                className="block hover:bg-gray-50"
              >
                <div className="flex items-center px-4 py-4 sm:px-6">
                  <div className="flex min-w-0 flex-1 items-center">
                    <div className="flex-shrink-0">
                      {/* <img className="h-12 w-12 rounded-full" src={application.applicant.imageUrl} alt="" /> */}
                    </div>
                    <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                      <div>
                        <p className="truncate text-sm font-medium text-indigo-600">
                          {file.name}
                        </p>
                        {/* <p className="mt-2 flex items-center text-sm text-gray-500">
                        <EnvelopeIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                        <span className="truncate">{application.applicant.email}</span>
                      </p> */}
                      </div>
                      <div className="hidden md:block">
                        <div>
                          <p className="text-sm text-gray-900">
                            Uploaded on{" "}
                            <time dateTime={file.created_at}>
                              {dayjs(file.created_at).format("YYYY-MM-DD")}
                            </time>
                          </p>
                          {/* <p className="mt-2 flex items-center text-sm text-gray-500">
                          <CheckCircleIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-green-400" aria-hidden="true" />
                          {application.stage}
                        </p> */}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <ChevronRightIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {/* <div>
        <ul>
          {files.map((file) => (
            <div key={file.name}>
              <Link to={file.name}>{file.name}</Link>
            </div>
          ))}
        </ul>
      </div> */}
      <div className="flex text-sm text-gray-600">
        <Form
          method="post"
          encType="multipart/form-data"
        >
          <label
            htmlFor="file-field"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            File to upload:
          </label>
          <div className="mx-auto mt-1 flex rounded-md shadow-sm">
            <div className="relative flex flex-grow items-stretch focus-within:z-10">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3" />
              <input
                id="file-field"
                type="file"
                name="fileSrc"
                className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400"
                accept=".pdf"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Upload
            </button>
          </div>
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
