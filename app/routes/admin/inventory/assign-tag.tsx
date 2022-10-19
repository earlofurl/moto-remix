import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useCatch,
  useLoaderData,
  useLocation,
  useNavigate,
  useTransition,
} from "@remix-run/react";
import React, { Fragment, useState } from "react";
import { requireAuthSession } from "~/modules/auth/guards";
import { AuthSession } from "~/modules/auth/session.server";
import { getUnassignedPackageTagsLimit20 } from "~/modules/packageTag/queries/get-package-tags.server";
import { usePackages } from "~/hooks/matches/use-packages";
import SlideInRight from "~/components/layout/SlideInRight";

export default function AssignTagSlideIn(): JSX.Element {
  return (
    <>
      <SlideInRight>
        <div>Assign Tag Slide In</div>
      </SlideInRight>
    </>
  );
}
