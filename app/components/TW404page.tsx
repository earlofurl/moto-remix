import Navbar from "./navbar";
import { Link } from "@remix-run/react";

export default function TW404page({
  status,
  statusText,
}: {
  status: number;
  statusText: string;
}): JSX.Element {
  return (
    <>
      <Navbar />
      <div className="flex min-h-full flex-col bg-brand-primary pt-16 pb-12">
        <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="flex flex-shrink-0 justify-center">
            <a
              href="/"
              className="inline-flex"
            >
              <span className="sr-only">Moto Perpetuo Farm Logo</span>
              <img
                className="h-12 w-auto"
                src="https://res.cloudinary.com/spark-visions/image/upload/q_auto:good,f_auto/v1654562278/moto/Moto_Logo_Primary_BLACK_fyxgwa.png"
                alt="Moto Logo"
              />
            </a>
          </div>
          <div className="py-16">
            <div className="text-center">
              <p className="text-2xl font-semibold uppercase tracking-wide text-gray-900">
                404 error
              </p>
              <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                Page not found.
              </h1>
              <p className="mt-2 text-base text-gray-500">
                Sorry, we couldn’t find the page you’re looking for.
              </p>
              <p className="mt-1 text-base text-gray-500">
                Please check the URL in the address bar and try again.
              </p>
              <div className="mt-6">
                <Link
                  to="/"
                  className="text-base font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Go back home<span aria-hidden="true"> &rarr;</span>
                </Link>
              </div>
            </div>
          </div>
          <p className="mt-1 text-base text-gray-500">
            There's also this message from Remix: {status} {statusText}
          </p>
        </main>
        <footer className="mx-auto w-full max-w-7xl flex-shrink-0 px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-center space-x-4">
            <a
              href="mailto:field@motoperpetuofarm.com"
              className="text-sm font-medium text-gray-500 hover:text-gray-600"
            >
              Contact Support
            </a>
            <span
              className="inline-block border-l border-gray-300"
              aria-hidden="true"
            />
            <a
              href="https://instagram.com/motoperpetuofarm"
              className="text-sm font-medium text-gray-500 hover:text-gray-600"
            >
              Instagram
            </a>
          </nav>
        </footer>
      </div>
    </>
  );
}
