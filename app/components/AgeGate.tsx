import {Form} from "@remix-run/react";

// Action is in root.tsx

export default function AgeGate(): JSX.Element {
    return (
        <div className="mx-auto min-h-screen min-w-full bg-brand-primary px-4 sm:px-6 lg:px-8">
            {/* We've used 3xl here, but feel free to try other max-widths based on your needs */}
            <div className="mx-auto max-w-3xl">
                <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <div className="w-full max-w-md space-y-8">
                        <div>
                            <img
                                className="mx-auto h-64 w-auto"
                                src="https://res.cloudinary.com/ursine-design/image/upload/q_auto:good,f_auto/v1654562278/Moto_Logo_Primary_BLACK_fyxgwa.png"
                                alt="Moto Logo"
                            />
                            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                                You must be 21 years of age or older to view this site.
                            </h2>
                        </div>
                        <Form
                            className="mt-8 space-y-6"
                            method="post"
                        >
                            <input
                                type="hidden"
                                name="disableAgeGate"
                                value="true"
                            />
                            <div>
                                <button
                                    type="submit"
                                    className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    I am 21 years of age or older
                                </button>
                            </div>
                            <div>
                                <a href="https://www.google.com/">
                                    <button
                                        type="button"
                                        className="group relative flex w-full justify-center rounded-md border border-transparent bg-gray-200 py-2 px-4 text-sm font-medium text-black hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Leave this site
                                    </button>
                                </a>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
}
