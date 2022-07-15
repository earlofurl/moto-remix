import type { Request } from "@remix-run/node";
import {
  Form,
  Link,
  useTransition,
  useCatch,
  Meta,
  Links,
  Scripts,
} from "@remix-run/react";
import React, { useRef, useEffect } from "react";
import Navbar from "~/core/components/navbar";
import { sendMail, trapSpam } from "~/core/integrations/mail/sendgrid.server";
import {
  TruckIcon,
  NewspaperIcon,
  DatabaseIcon,
  GlobeIcon,
  HandIcon,
} from "@heroicons/react/solid";
import TW404page from "~/core/components/TW404page";

const features = [
  {
    name: "Delivery",
    description:
      "We offer Storage and Delivery for all processors across the state. Your order is delivered to your door in freezers - frozen solid from harvest to delivery.",
    icon: TruckIcon,
  },
  {
    name: "Contract Crops",
    description:
      "In addition to these services, we also offer Contract Crops. Having a hard time finding a particular strain? Reach out to find out how we can help you reach your goal!",
    icon: NewspaperIcon,
  },
  {
    name: "Strain Information",
    description:
      "Take the guesswork out of your extraction projections. We have a database of strains that you can use to help you plan.",
    icon: DatabaseIcon,
  },
];

export async function action({ request }: { request: Request }): Promise<null> {
  const body = await request.formData();
  const name = body.get("full-name") as string;
  const email = body.get("email") as string;
  const phone = body.get("phone") as string;
  const message = body.get("message") as string;
  const human_test = body.get("query") as string;

  if (
    (human_test.toLowerCase() === "oregon" ||
      human_test.toLowerCase() === "or") &&
    name &&
    email &&
    phone &&
    message
  ) {
    await sendMail({ name, email, phone, message });
    console.log("Mail supposedly sent.");
  } else {
    await trapSpam({ name, email, phone, message, human_test });
    console.log("Bot caught in snare.");
  }

  return null;
}

export default function Index(): JSX.Element {
  const transition = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  // Detect when form is submitting
  const isSending =
    transition.state === "submitting" &&
    transition.submission.formData.get("_action") === "send";

  useEffect(() => {
    if (!isSending) {
      formRef.current?.reset();
    }
  }, [isSending]);

  return (
    <div className="bg-brand-primary">
      <Navbar />
      <main>
        {/* Hero section */}
        <div className="relative">
          <div className="absolute inset-x-0 bottom-0 h-1/2" />
          <div className="mx-auto w-full">
            <div className="relative shadow-xl sm:overflow-hidden">
              <div className="absolute inset-0">
                <img
                  className="h-full w-full object-cover"
                  src="https://res.cloudinary.com/ursine-design/image/upload/q_auto,f_auto/v1654560593/moto_trellis_splash.jpg"
                  alt="Cannabis in trellis"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-brand-primary to-brand-primary/25" />
              </div>
              <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
                <img
                  className="mx-auto mb-6 h-64 w-64 rounded-full bg-brand-primary bg-opacity-60"
                  src="https://res.cloudinary.com/ursine-design/image/upload/q_auto:good,f_auto/v1654562278/Moto_Logo_Primary_BLACK_fyxgwa.png"
                  alt="Moto Perpetuo Farm Logo"
                />
                <h1 className="text-center text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                  <span className="block text-black">Moto Perpetuo Farm</span>
                  <span className="block text-brand-secondary">
                    find your high
                  </span>
                </h1>
                <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                  <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
                    <Link
                      to="/#contact"
                      className="text-gray-1000 flex items-center justify-center rounded-md border border-transparent bg-brand-primary/80 px-4 py-3 text-base font-semibold shadow-sm hover:bg-green-200 sm:px-8"
                    >
                      Contact Us
                    </Link>
                    <Link
                      to="/db/strain-and-processing-data"
                      className="flex items-center justify-center rounded-md border border-transparent bg-green-800 px-4 py-3 text-base font-semibold text-gray-200 shadow-sm hover:bg-green-900 hover:text-green-100 sm:px-8"
                    >
                      View 2022 Fresh Frozen
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logo Cloud */}
        <div className="bg-gray-100">
          <div className="mx-auto max-w-7xl py-16 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm font-semibold uppercase tracking-wide text-gray-500">
              Trusted by experienced processors.
            </p>
            <div className="mx-auto flex grid grid-cols-2 flex-wrap justify-between gap-10 py-6 sm:grid-cols-4">
              <a href="https://nwkind.com/">
                <span className="sr-only">NW Kind</span>
                <img
                  className="h-12"
                  src="https://res.cloudinary.com/ursine-design/image/upload/v1654629741/NWKind_Logo_nbr1xn.png"
                  alt="NW Kind"
                />
              </a>
              <a href="https://curaleaf.com/">
                <span className="sr-only">Curaleaf</span>
                <svg
                  data-name="Curaleaf Logo"
                  width="120"
                  height="48"
                >
                  <g data-name="Group 439">
                    <path
                      data-name="Path 43"
                      d="M57.255 25.587a5.575 5.575 0 0 0 5.6 5.531 5.787 5.787 0 0 0 4.428-1.98 1.124 1.124 0 0 1 .853-.423.97.97 0 0 1 1.017.976 1.13 1.13 0 0 1-.328.782 7.815 7.815 0 0 1-5.965 2.538 7.759 7.759 0 0 1-7.931-8 7.716 7.716 0 0 1 7.735-8c4.423 0 7.34 2.961 7.34 7.451 0 .747-.393 1.138-1.211 1.138Zm10.488-1.756c-.132-2.864-1.9-4.978-5.08-4.978a5.414 5.414 0 0 0-5.375 4.978Z"
                      fill="#000"
                    />
                  </g>
                  <g data-name="Group 440">
                    <path
                      data-name="Path 44"
                      d="M54.657 31.153a1 1 0 0 1-.968-.541 2.535 2.535 0 0 1-.215-1.121V12.635a.942.942 0 0 0-.3-.695 1.079 1.079 0 0 0-.8-.29 1.076 1.076 0 0 0-.8.29.937.937 0 0 0-.3.695V29.64a4.185 4.185 0 0 0 .646 2.578 2.345 2.345 0 0 0 1.977.786 1.413 1.413 0 0 0 .988-.28.989.989 0 0 0 .294-.764 1.213 1.213 0 0 0-.154-.62.375.375 0 0 0-.379-.188"
                      fill="#000"
                    />
                  </g>
                  <g data-name="Group 441">
                    <path
                      data-name="Path 45"
                      d="M96.557 12.194a1.075 1.075 0 0 0-.642-.395 3.137 3.137 0 0 0-.555-.093 9.674 9.674 0 0 0-1.015-.045 5.1 5.1 0 0 0-4.11 1.693 6.944 6.944 0 0 0-1.555 4.841v13.8a.948.948 0 0 0 .3.719 1.079 1.079 0 0 0 .778.29 1.066 1.066 0 0 0 .79-.286.971.971 0 0 0 .29-.723v-12.33h3.431a.916.916 0 0 0 .681-.271.941.941 0 0 0 .273-.707.864.864 0 0 0-.266-.663.953.953 0 0 0-.688-.254h-3.422l.02-.288a4.656 4.656 0 0 1 .95-2.817 2.966 2.966 0 0 1 2.558-1.047 5.567 5.567 0 0 1 .839.051 4.374 4.374 0 0 0 .6.041 1.007 1.007 0 0 0 .67-.227.891.891 0 0 0 .259-.722 1.011 1.011 0 0 0-.186-.567"
                      fill="#000"
                    />
                  </g>
                  <g data-name="Group 442">
                    <path
                      data-name="Path 46"
                      d="M12.748 29.296a.936.936 0 0 1 .982.944 1.141 1.141 0 0 1-.393.845 7.1 7.1 0 0 1-5.143 1.92c-4.948 0-8.193-3.415-8.193-8s3.245-8 8.193-8a7.5 7.5 0 0 1 4.947 1.814 1.181 1.181 0 0 1 .425.879.989.989 0 0 1-1.015.972c-.3 0-.525-.065-1.114-.618a4.7 4.7 0 0 0-3.212-1.201c-3.573 0-5.865 2.669-5.865 6.151 0 3.447 2.26 6.117 5.833 6.117a5.057 5.057 0 0 0 3.67-1.4 1.287 1.287 0 0 1 .885-.423"
                      fill="#000"
                    />
                  </g>
                  <g data-name="Group 443">
                    <path
                      data-name="Path 47"
                      d="M26.196 16.999a1.207 1.207 0 0 0-.772.263.952.952 0 0 0-.354.764v8.833a5.157 5.157 0 0 1-.261 1.669 3.494 3.494 0 0 1-.772 1.29 3.735 3.735 0 0 1-1.246.853 4.277 4.277 0 0 1-1.695.313 4.263 4.263 0 0 1-1.691-.314 3.723 3.723 0 0 1-1.248-.853 3.463 3.463 0 0 1-.77-1.29 5.14 5.14 0 0 1-.26-1.668v-8.833a.941.941 0 0 0-.354-.764 1.207 1.207 0 0 0-.772-.263 1.077 1.077 0 0 0-.755.277.976.976 0 0 0-.308.749v8.774a7.557 7.557 0 0 0 .385 2.457 5.5 5.5 0 0 0 1.173 1.969 5.363 5.363 0 0 0 1.942 1.314 7.067 7.067 0 0 0 2.658.467 6.976 6.976 0 0 0 2.627-.466 5.38 5.38 0 0 0 1.942-1.314 5.691 5.691 0 0 0 1.187-1.969 7.21 7.21 0 0 0 .408-2.458v-8.773a.972.972 0 0 0-.312-.75 1.072 1.072 0 0 0-.752-.277"
                      fill="#000"
                    />
                  </g>
                  <g data-name="Group 444">
                    <path
                      data-name="Path 48"
                      d="M50.345 31.346a.375.375 0 0 0-.379-.188 1 1 0 0 1-.97-.539 2.569 2.569 0 0 1-.213-1.12V17.982a.941.941 0 0 0-.3-.693 1.068 1.068 0 0 0-.8-.292 1.064 1.064 0 0 0-.8.292.936.936 0 0 0-.3.693v2.07a7.514 7.514 0 0 0-1.8-1.944 6.172 6.172 0 0 0-3.749-1.11 6.985 6.985 0 0 0-2.923.614 7.387 7.387 0 0 0-2.334 1.67 7.811 7.811 0 0 0-1.558 2.551 8.928 8.928 0 0 0-.563 3.183 9.03 9.03 0 0 0 .547 3.166 7.57 7.57 0 0 0 1.545 2.536 7.357 7.357 0 0 0 2.317 1.675 6.893 6.893 0 0 0 2.908.614 6.171 6.171 0 0 0 3.733-1.155 7.8 7.8 0 0 0 1.9-2v-.11a4.127 4.127 0 0 0 .64 2.479 2.334 2.334 0 0 0 1.973.786 1.421 1.421 0 0 0 .986-.28 1 1 0 0 0 .291-.763 1.21 1.21 0 0 0-.152-.618m-9.127-.539c-3.307 0-5.381-2.6-5.381-5.819s2.211-5.821 5.381-5.821a5.589 5.589 0 0 1 5.379 5.821 5.461 5.461 0 0 1-5.379 5.819"
                      fill="#000"
                    />
                  </g>
                  <g data-name="Group 445">
                    <path
                      data-name="Path 49"
                      d="M41.633 15.047a1.028 1.028 0 0 0 .818-.32 1.111 1.111 0 0 0 .26-.751c0-.294-.217-1.195-1.679-1.195a11.028 11.028 0 0 0-6.441 1.944 9.837 9.837 0 0 0-3.364 4.416V18a.951.951 0 0 0-1.077-1 1.069 1.069 0 0 0-.788.29.972.972 0 0 0-.288.71v13.965a.966.966 0 0 0 .336.766 1.151 1.151 0 0 0 .774.273 1.1 1.1 0 0 0 .764-.28.988.988 0 0 0 .314-.76v-4.993a20.34 20.34 0 0 1 .188-3.956 11.654 11.654 0 0 1 1.4-3.676 8.455 8.455 0 0 1 2.475-2.7 7.04 7.04 0 0 1 .573-.352 11.884 11.884 0 0 1 5.735-1.24"
                      fill="#000"
                    />
                  </g>
                  <g data-name="Group 446">
                    <path
                      data-name="Path 50"
                      d="M87.38 31.346a.375.375 0 0 0-.379-.188 1 1 0 0 1-.97-.539 2.569 2.569 0 0 1-.213-1.12V17.982a.941.941 0 0 0-.3-.693 1.068 1.068 0 0 0-.8-.292 1.064 1.064 0 0 0-.8.292.936.936 0 0 0-.3.693v2.07a7.514 7.514 0 0 0-1.8-1.944 6.172 6.172 0 0 0-3.749-1.11 6.985 6.985 0 0 0-2.923.614 7.387 7.387 0 0 0-2.334 1.67 7.811 7.811 0 0 0-1.558 2.551 8.928 8.928 0 0 0-.563 3.183 9.03 9.03 0 0 0 .547 3.166 7.57 7.57 0 0 0 1.545 2.536 7.357 7.357 0 0 0 2.317 1.675 6.893 6.893 0 0 0 2.908.614 6.171 6.171 0 0 0 3.733-1.155 7.8 7.8 0 0 0 1.9-2v-.11a4.127 4.127 0 0 0 .64 2.479 2.334 2.334 0 0 0 1.973.786 1.421 1.421 0 0 0 .986-.28 1 1 0 0 0 .291-.763 1.21 1.21 0 0 0-.152-.618m-9.127-.539c-3.307 0-5.381-2.6-5.381-5.819s2.211-5.821 5.381-5.821a5.589 5.589 0 0 1 5.379 5.821 5.461 5.461 0 0 1-5.379 5.819"
                      fill="#000"
                    />
                  </g>
                  <g data-name="Group 447">
                    <path
                      data-name="Path 51"
                      d="M56.785.033c-.207-.2-1.746.541-3.346.711A8.689 8.689 0 0 0 47.454 3.2c-3 2.919-1.458 7.174-1.339 6.87a6.817 6.817 0 0 1 1.906-6.011 9.44 9.44 0 0 1 6.895-2.343s-.31 4.608-2.66 6.85a6.559 6.559 0 0 1-4.156 1.993l.107-.51a10.623 10.623 0 0 1 .299-1.333 4.752 4.752 0 0 1 .577-1.167 7.57 7.57 0 0 1 .844-1.025c.079-.081.152-.166.235-.241.016-.018.192-.174.138-.2-.038-.02-.105 0-.144.014a1.367 1.367 0 0 0-.282.119 2.987 2.987 0 0 0-.389.245 4.718 4.718 0 0 0-.466.387 6.227 6.227 0 0 0-.508.551 7.172 7.172 0 0 0-.525.731 8.732 8.732 0 0 0-.506.928c-.217.46-.373.944-.579 1.406a9.5 9.5 0 0 1-.743 1.349 1.44 1.44 0 0 1-.928.691 2.291 2.291 0 0 1-.466.057 1.8 1.8 0 0 0-.9.253 1.13 1.13 0 0 0-.312 1.5c.306.476 1.118.482 1.6.318a3.392 3.392 0 0 0 1.361-1.154.212.212 0 0 0 .016-.022l.049-.065c.024-.032.049-.065.073-.1s.063-.083.093-.126.073-.1.109-.148l.122-.164.126-.17.128-.17.122-.166c.041-.055.077-.1.113-.154s.067-.089.1-.134l.081-.109.043-.057a.332.332 0 0 1 .041-.053.273.273 0 0 1 .136-.047c.043-.006.083-.006.124-.008h.049a.538.538 0 0 1 .057-.006 10.271 10.271 0 0 0 1.637-.346 8.034 8.034 0 0 0 2.212-1.007 5.463 5.463 0 0 0 .735-.6c2.7-2.637 2.991-5.732 3.37-7.2s.938-2.4.731-2.6"
                      fill="#000"
                    />
                  </g>
                  <path
                    data-name="Path 52"
                    d="M0 33.006h96.742V-.004H0Z"
                    fill="none"
                  />
                </svg>
              </a>
              <a href="https://selectcannabis.com/">
                <span className="sr-only">Select Cannabis</span>
                <svg
                  className="Header--logo  "
                  width="120px"
                  height="60px"
                >
                  <g
                    stroke="none"
                    strokeWidth="1"
                    fill="#000"
                    fillRule="evenodd"
                  >
                    <g
                      id="logo"
                      transform="translate(-125.000000, -50.000000)"
                      fill="black"
                    >
                      <g
                        id="Select-Logo-full"
                        transform="translate(125.000000, 50.000000)"
                      >
                        <g transform="translate(-0.000000, 0.000000)">
                          <path
                            id="icon"
                            fillRule="nonzero"
                            d="M18.0036049,31.4265185 L28.0668148,31.4265185 L28.0668148,34.6317531 L18.0036049,34.6317531 L18.0036049,31.4265185 Z M45.9840988,22.9500247 C45.9840988,35.604 35.6891852,45.8989136 23.0408889,45.8989136 C10.3925926,45.8989136 0.0851851852,35.604 0.0851851852,22.9500247 C0.0851851852,10.2960494 10.3823704,0 23.0352099,0 C35.6880494,0 45.9840988,10.2949136 45.9840988,22.9500247 Z M42.78,22.9500247 C42.78,12.0622222 33.9207407,3.20523457 23.0352099,3.20523457 C12.149679,3.20523457 3.29041975,12.0644938 3.29041975,22.9500247 C3.29041975,33.8355556 12.149679,42.693679 23.0352099,42.693679 C33.9207407,42.693679 42.78,33.8366914 42.78,22.9500247 L42.78,22.9500247 Z M24.4118025,18.0660741 C21.884642,17.5152099 20.5886914,17.2233086 20.5886914,16.0216296 C20.5886914,15.0164444 21.6574815,14.4315062 23.2453333,14.4315062 C25.0478519,14.4315062 26.4312593,15.1129877 27.2581235,16.0920494 L29.7784691,14.0328395 C28.4495802,12.3291358 26.4676049,11.224 23.4395556,11.224 C19.4222222,11.224 17.0245432,13.1355556 17.0245432,16.180642 C17.0245432,19.7459259 20.2320494,20.6852346 22.7592099,21.2031605 C25.1898272,21.7222222 26.3562963,22.0141235 26.3562963,23.2771358 C26.3562963,24.5083457 25.2204938,25.0274074 23.569037,25.0274074 C21.6279506,25.0274074 19.8526914,24.4186173 18.7986667,23.0034074 L16.2499259,25.0853333 C17.6424198,27.243358 20.3388148,28.2031111 23.3407407,28.2031111 C27.2297284,28.2031111 29.9181728,26.6129877 29.9181728,23.0511111 C29.9181728,19.4892346 27.1661235,18.6771358 24.4118025,18.0592593 L24.4118025,18.0660741 Z"
                          />
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              </a>
              <a href="https://www.jollybend.com/">
                <span className="sr-only">Dr. Jolly's</span>
                <img
                  className="h-16 pr-8 pb-2"
                  src="https://res.cloudinary.com/ursine-design/image/upload/q_auto:good,f_auto/v1654649530/DRJ_web_rip_ze7zyo.png"
                  alt="Dr. Jolly's"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Gradient Feature Section */}
        <div className="bg-gradient-to-r from-brand-secondary/80 to-green-700">
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:pt-20 sm:pb-24 lg:max-w-7xl lg:px-8 lg:pt-24">
            <h2 className="text-3xl font-extrabold tracking-tight text-white">
              Storage, Delivery, and Contract Crops
            </h2>
            <p className="mt-4 max-w-3xl text-lg text-gray-300">
              We offer Storage and Delivery for all processors across the state.
              Your order is delivered to your door in freezers - frozen solid
              from harvest to delivery.
            </p>

            <p className="mt-4 max-w-3xl text-lg text-gray-300">
              In addition to these services, we also offer Contract Crops.
              Having a hard time finding a particular strain? Reach out to find
              out how we can help you reach your goal!
            </p>
            <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16">
              {features.map((feature) => (
                <div key={feature.name}>
                  <div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-md bg-white bg-opacity-10">
                      <feature.icon className="h-8 w-8 text-green-200" />
                    </span>
                  </div>
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-white">
                      {feature.name}
                    </h3>
                    <p className="mt-2 text-base text-purple-200">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
              <div className="relative grid grid-cols-1">
                <div className="col-span-1 row-span-1">
                  <Link
                    to="/#contact"
                    className="flex items-center justify-center rounded-md border border-transparent bg-green-800 px-4 py-3 text-base font-semibold text-gray-200 shadow-sm hover:bg-green-700 sm:px-8"
                  >
                    Get Started
                  </Link>
                </div>
                <div className="col-span-1 row-span-1">
                  <Link
                    to="/db/strain-and-processing-data"
                    className="flex items-center justify-center rounded-md border border-transparent bg-green-900 px-4 py-3 text-base font-semibold text-gray-200 shadow-sm hover:bg-opacity-70 sm:px-8"
                  >
                    View Processing Data
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alternating Feature Sections */}
        <div
          className="relative overflow-hidden pt-16 pb-32"
          id="about"
        >
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-gray-100"
          />
          <div className="relative">
            <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8">
              <div className="mx-auto max-w-xl px-4 sm:px-6 lg:mx-0 lg:max-w-none lg:py-16 lg:px-0">
                <div>
                  <div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-br from-green-800 to-brand-accent-light">
                      <GlobeIcon
                        className="h-8 w-8 text-green-100"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                  <div className="mt-6">
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                      We grow cannabis with a focus on quality and
                      sustainability.
                    </h2>
                    <p className="mt-4 text-lg text-gray-700">
                      Our close attention to every step of the cultivation
                      process is rooted in the belief that exceptional flower is
                      born from a sustained marriage of soil, climate and artful
                      post harvest stewardship; the interaction of the hand and
                      the land.
                    </p>

                    <p className="mt-4 text-lg text-gray-700">
                      We firmly believe that a biologically active soil – rich
                      in organic nutrients – produces the highest quality flower
                      that is rich in terpenes and flavor. Our freshly frozen
                      cannabis has led processors to multiple awards including
                      High Times Cups and Oregon Grower Cups for various formats
                      of concentrates and extracts.
                    </p>
                    <div className="mt-6">
                      <Link
                        to="/#contact"
                        className="inline-flex rounded-md border border-transparent bg-green-800 bg-origin-border px-4 py-2 text-base font-semibold text-white shadow-sm hover:bg-brand-secondary"
                      >
                        Get started
                      </Link>
                    </div>
                  </div>
                </div>
                {/*<div className="mt-8 border-t border-gray-200 pt-6">*/}
                {/*  <blockquote>*/}
                {/*    <div>*/}
                {/*      <p className="text-base font-bold text-gray-800">*/}
                {/*        &ldquo;Wow, we squeezed a lot of dank chronic out of*/}
                {/*        this phyre bud, brah!&rdquo;*/}
                {/*      </p>*/}
                {/*    </div>*/}
                {/*    <footer className="mt-3">*/}
                {/*      <div className="flex items-center space-x-3">*/}
                {/*        <div className="flex-shrink-0">*/}
                {/*          <img*/}
                {/*            className="h-20 w-20 rounded-full"*/}
                {/*            src="https://res.cloudinary.com/ursine-design/image/upload/c_thumb,w_200,g_face,q_auto:good,f_auto/v1654568623/20170604_1559482_hnleee.jpg"*/}
                {/*            alt=""*/}
                {/*          />*/}
                {/*        </div>*/}
                {/*        <div className="text-base font-medium text-gray-600">*/}
                {/*          Tom Grubbs, Cascade Chronic Drangletang*/}
                {/*        </div>*/}
                {/*      </div>*/}
                {/*    </footer>*/}
                {/*  </blockquote>*/}
                {/*</div>*/}
              </div>
              <div className="mt-12 sm:mt-16 lg:mt-0">
                <div className="-mr-48 pl-4 sm:pl-6 md:-mr-16 lg:relative lg:m-0 lg:h-full lg:px-0">
                  <img
                    className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                    src="https://res.cloudinary.com/ursine-design/image/upload/q_auto,f_auto/v1655925822/JPEG_20181012_092822.427_kewqdb.jpg"
                    alt="Frosty Bud."
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-24">
            <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8">
              <div className="mx-auto max-w-xl px-4 sm:px-6 lg:col-start-2 lg:mx-0 lg:max-w-none lg:py-32 lg:px-0">
                <div>
                  <div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-md bg-lime-600">
                      <HandIcon
                        className="h-8 w-8 text-green-100"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                  <div className="mt-6">
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                      Growing and Harvest Methods
                    </h2>
                    <p className="mt-4 text-lg text-gray-700">
                      We employ a cultivar specific fertility program that is
                      soil based, incorporating composting, cover cropping,
                      mineral amendments and compost teas. From seed to flower,
                      we employ age-old organic and bio-dynamic farming
                      practices with an eye to the appropriate use of effective
                      and innovative technology to aid in the most efficient use
                      of resources.
                    </p>

                    <p className="mt-4 text-lg text-gray-700">
                      These methods in addition to maintaining meticulous
                      records of processor yields and terpene percentages from
                      the past 6 years allow us to confidently offer strains
                      that have historically yielded over 5% for Live Resin
                      along with double-digit terpene yields. Our harvest method
                      entails a unique, in-house approach that was successfully
                      developed to yield better results for the processor. No
                      other farm will deliver cleaner material for you to
                      process.
                    </p>
                    <div className="mt-6">
                      <Link
                        to="/#contact"
                        className="hover:from-red-00 inline-flex rounded-md border border-transparent bg-gradient-to-r from-emerald-600 to-green-600 bg-origin-border px-4 py-2 text-base font-semibold text-white shadow-sm hover:to-red-500"
                      >
                        Get started
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-12 sm:mt-16 lg:col-start-1 lg:mt-0">
                <div className="-ml-48 pr-4 sm:pr-6 md:-ml-16 lg:relative lg:m-0 lg:h-full lg:px-0">
                  <img
                    className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:right-0 lg:h-full lg:w-auto lg:max-w-none"
                    src="https://res.cloudinary.com/ursine-design/image/upload/q_auto,f_auto/v1654564806/moto_card_1920x1280_cola_01_y5kena.jpg"
                    alt="Cola"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-green-200">
          <div className="mx-auto max-w-4xl py-16 px-4 sm:px-6 sm:py-24 lg:flex lg:max-w-7xl lg:items-center lg:justify-between lg:px-8">
            <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              <span className="block">Ready to get started?</span>
              <span className="-mb-1 block bg-gradient-to-r from-brand-secondary to-green-700 bg-clip-text pb-1 text-transparent">
                Get in touch!
              </span>
            </h2>
            <div className="mt-6 space-y-4 sm:flex sm:space-y-0 sm:space-x-5">
              <Link
                to="/db/strain-and-processing-data"
                className="flex items-center justify-center rounded-md border border-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-origin-border px-4 py-3 text-base font-medium text-white shadow-sm hover:from-green-700 hover:to-emerald-700"
              >
                Learn more
              </Link>
              <Link
                to="/#contact"
                className="flex items-center justify-center rounded-md border border-transparent bg-indigo-50 px-4 py-3 text-base font-medium text-indigo-800 shadow-sm hover:bg-indigo-100"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>

        {/*  Contact Section */}
        <div
          className="relative bg-white"
          id="contact"
        >
          <div className="absolute inset-0">
            <div className="absolute inset-y-0 left-0 w-1/2 bg-gray-50" />
          </div>
          <div className="relative mx-auto max-w-7xl lg:grid lg:grid-cols-5">
            <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:col-span-2 lg:px-8 lg:py-24 xl:pr-12">
              <div className="mx-auto max-w-lg">
                <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                  Say hey.
                </h2>
                <p className="mt-3 text-lg leading-6 text-gray-500">
                  Check us out on social media or send us an email. Use the form
                  on the right to send an email right away.
                </p>
                <dl className="mt-8 text-base text-gray-500">
                  <div>
                    <dt className="sr-only">Locations</dt>
                    <dd>
                      <p>Forest Grove, OR</p>
                      <p>Grants Pass, OR</p>
                      <p>Applegate, OR</p>
                    </dd>
                  </div>
                  <div className="mt-6">
                    <dt className="sr-only">Phone number</dt>
                    <dd className="flex">
                      <img
                        className="h-6 w-6 flex-shrink-0"
                        src="https://res.cloudinary.com/ursine-design/image/upload/q_auto,f_auto,h_20,w_20/v1655324486/Instagram_Glyph_Black_c0soj4.png"
                        alt="Instagram Logo"
                      />
                      <span className="ml-3">
                        <a href="https://instagram.com/motoperpetuofarm">
                          @motoperpetuofarm
                        </a>
                      </span>
                    </dd>
                  </div>
                  <div className="mt-3">
                    <dt className="sr-only">Email</dt>
                    <dd className="flex">
                      <div
                        className="i-fa6-solid-square-envelope h-6 w-6 flex-shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      <span className="ml-3">
                        <a href="mailto:info@motoperpetuofarm.com">
                          info@motoperpetuofarm.com
                        </a>
                      </span>
                    </dd>
                  </div>
                </dl>
                {/*<p className="mt-6 text-base text-gray-500">*/}
                {/*  Looking for careers?{" "}*/}
                {/*  <a*/}
                {/*    href="#"*/}
                {/*    className="font-medium text-gray-700 underline"*/}
                {/*  >*/}
                {/*    View all job openings*/}
                {/*  </a>*/}
                {/*  .*/}
                {/*</p>*/}
              </div>
            </div>
            <div className="bg-white py-16 px-4 sm:px-6 lg:col-span-3 lg:py-24 lg:px-8 xl:pl-12">
              <div className="mx-auto max-w-lg lg:max-w-none">
                <Form
                  method="post"
                  ref={formRef}
                  className="grid grid-cols-1 gap-y-6"
                >
                  <div>
                    <label
                      htmlFor="full-name"
                      className="sr-only"
                    >
                      Full name
                    </label>
                    <input
                      type="text"
                      name="full-name"
                      id="full-name"
                      autoComplete="name"
                      className="block w-full rounded-md border-gray-300 py-3 px-4 placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="sr-only"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="block w-full rounded-md border-gray-300 py-3 px-4 placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Email"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="sr-only"
                    >
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      autoComplete="tel"
                      className="block w-full rounded-md border-gray-300 py-3 px-4 placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Phone"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="sr-only"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="block w-full rounded-md border border-gray-300 py-3 px-4 placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Message"
                      defaultValue=""
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="tricky-question"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Which state is located between Washington and California?
                    </label>
                    <input
                      type="text"
                      name="query"
                      id="query"
                      className="block w-full rounded-md border-gray-300 py-3 px-4 placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Tricky Question"
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      disabled={isSending}
                      name="_action"
                      value="send"
                      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-6 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Submit
                    </button>
                    {isSending ? <p>Sending...</p> : null}
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }): JSX.Element {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">
        <span
          role="img"
          aria-label="Sad face"
        >
          😢
        </span>
      </h1>
      <p className="text-lg">There was an error: {error.message}</p>
      <div className="mt-6">
        <Link
          to="/"
          className="text-base font-medium text-indigo-600 hover:text-indigo-500"
        >
          Go back home<span aria-hidden="true"> &rarr;</span>
        </Link>
      </div>
    </div>
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
        <TW404page
          status={caught.status}
          statusText={caught.statusText}
        />
        <Scripts />
      </body>
    </html>
  );
}
