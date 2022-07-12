import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useCatch
} from "@remix-run/react";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import { SUPABASE_ANON_PUBLIC, SUPABASE_URL } from "./core/utils/env.server";
import TW404page from './core/components/TW404page';

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindStylesheetUrl },
  {
    rel: "stylesheet",
    href: "https://api.mapbox.com/mapbox-gl-js/v2.8.2/mapbox-gl.css",
  },
];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Moto Perpetuo Farm",
  viewport: "width=device-width,initial-scale=1",
});

export const loader: LoaderFunction = async ({ request }) => {
  const proto = request.headers.get("X-Forwarded-Proto");

  json({
    ENV: {
      SUPABASE_URL,
      SUPABASE_ANON_PUBLIC,
    },
  });

  if (proto === "http") {
    const url = new URL(request.url);
    url.protocol = "https:";
    return redirect(url.toString(), { status: 302 });
  }

  return {};
};

// export const loader: LoaderFunction = async ({ request }) =>
//   // uncomment if you want to use realtime supabase features
//   // const authSession = await getAuthSession(request);
//
//   // return json({
//   //   realtimeSession: {
//   //     accessToken: authSession?.accessToken,
//   //     expiresIn: authSession?.expiresIn,
//   //     expiresAt: authSession?.expiresAt,
//   //   },
//   //   ENV: {
//   //     SUPABASE_URL,
//   //     SUPABASE_ANON_PUBLIC,
//   //   },
//   // });
//   json({
//     ENV: {
//       SUPABASE_URL,
//       SUPABASE_ANON_PUBLIC,
//     },
//   });

// export default function App(): JSX.Element {
//   const { ENV } = useLoaderData();

//   return (
//     <html lang="en">
//       <head>
//         <Meta />
//         <Links />
//       </head>
//       <body>
//         <Outlet />
//         <ScrollRestoration />
//         <script
//           dangerouslySetInnerHTML={{
//             __html: `window.ENV = ${JSON.stringify(ENV)}`,
//           }}
//         />
//         <Scripts />
//         <LiveReload />
//       </body>
//     </html>
//   );
// }

function Document({ children }: { children: React.ReactNode }): JSX.Element {
  const { ENV } = useLoaderData();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
          }}
        />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App(): JSX.Element {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }): JSX.Element {
  return (
    <Document>
      <div className="flex h-full flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">
          <span role="img" aria-label="Sad face">
            😢
          </span>
        </h1>
        <p className="text-lg">There was an error: {error.message}</p>
        <div className="mt-6">
                  <Link to="/" className="text-base font-medium text-indigo-600 hover:text-indigo-500">
                    Go back home<span aria-hidden="true"> &rarr;</span>
                  </Link>
                </div>
      </div>
    </Document>
  );
}

export function CatchBoundary(): JSX.Element {
  const caught = useCatch();
  return (
    <html>
      <head>
        <title>Oops!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <TW404page status={caught.status} statusText={caught.statusText} />
        <Scripts />
      </body>
    </html>
  );
}