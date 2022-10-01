import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { ActionFunction, json, redirect } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useCatch,
} from "@remix-run/react";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import { SUPABASE_ANON_PUBLIC, SUPABASE_URL } from "~/utils/env";
import TW404page from "./components/TW404page";
import React from "react";
import { ageGate } from "~/utils/cookies";
import AgeGate from "~/components/AgeGate";
import { getBrowserEnv } from "./utils/env";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindStylesheetUrl },
  {
    rel: "stylesheet",
    href: "https://api.mapbox.com/mapbox-gl-js/v2.8.2/mapbox-gl.css",
  },
];

export const meta: MetaFunction = () => {
  const description =
    "Oregon's best family owned and operated cannabis producers. Award winning proprietary strains with record-setting extraction results.";
  return {
    charset: "utf-8",
    description,
    title: "Moto Perpetuo Farm",
    keywords:
      "cannabis, farm, grower, producer, oregon, recreational, weed, pot, wholesaler, terpenes, fresh frozen",
    viewport: "width=device-width,initial-scale=1",
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  const proto = request.headers.get("X-Forwarded-Proto");
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await ageGate.parse(cookieHeader)) || {};

  if (proto === "http") {
    const url = new URL(request.url);
    url.protocol = "https:";
    return redirect(url.toString(), { status: 302 });
  }

  return json({ showAgeGate: cookie.showAgeGate, env: getBrowserEnv() });
};

export const action: ActionFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await ageGate.parse(cookieHeader)) || {};
  const bodyParams = await request.formData();

  if (bodyParams.get("disableAgeGate") === "true") {
    cookie.showAgeGate = false;
  }

  return redirect("/", {
    headers: {
      "Set-Cookie": await ageGate.serialize(cookie),
    },
  });
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

function Document({ children }: { children: React.ReactNode }): JSX.Element {
  const { env, showAgeGate } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {showAgeGate === false ? <Outlet /> : <AgeGate />}
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.env = ${JSON.stringify(env)}`,
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

// export function ErrorBoundary({ error }: { error: Error }): JSX.Element {
//   return (
//     <Document>
//       <div className="flex h-full flex-col items-center justify-center">
//         <h1 className="text-4xl font-bold">
//           <span
//             role="img"
//             aria-label="Sad face"
//           >
//             😢
//           </span>
//         </h1>
//         <p className="text-lg">There was an error: {error.message}</p>
//         <div className="mt-6">
//           <Link
//             to="/"
//             className="text-base font-medium text-indigo-600 hover:text-indigo-500"
//           >
//             Go back home<span aria-hidden="true"> &rarr;</span>
//           </Link>
//         </div>
//       </div>
//     </Document>
//   );
// }

// export function CatchBoundary(): JSX.Element {
//   const caught = useCatch();
//   return (
//     <html>
//       <head>
//         <title>Oops!</title>
//         <Meta />
//         <Links />
//       </head>
//       <body>
//         <TW404page
//           status={caught.status}
//           statusText={caught.statusText}
//         />
//         <Scripts />
//       </body>
//     </html>
//   );
// }
