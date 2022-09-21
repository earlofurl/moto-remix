import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import React from "react";
import { z } from "zod";
import {
  AuthSession,
  getAuthSession,
  createAuthSession,
} from "~/modules/auth/session.server";
import { assertIsPost } from "~/utils/http.server";
import { getFormData, useFormInputProps } from "remix-params-helper";
import {
  refreshAuthSession,
  updateUserPassword,
} from "~/modules/auth/mutations";
import { requireAuthSession } from "~/modules/auth/guards";
import { authSession } from "mocks/handlers";
import { parseJwt } from "../utils/mytools";

type LoaderData = {
  authSession: AuthSession;
};

export const loader: LoaderFunction = async ({ request }) => {
  await requireAuthSession(request, { onFailRedirectTo: "/login" });

  return authSession;
};

const ResetPasswordFormSchema = z.object({
  password: z.string().min(8, "password-too-short"),
  redirectTo: z.string().optional(),
});

type ActionData = {
  errors?: {
    password?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  assertIsPost(request);

  const formValidation = await getFormData(request, ResetPasswordFormSchema);

  if (!formValidation.success) {
    return json<ActionData>(
      {
        errors: {
          password: formValidation.errors.password,
        },
      },
      { status: 400 }
    );
  }

  const { password, redirectTo = "/admin" } = formValidation.data;

  const newAuthSession = await updateUserPassword(
    authSession.accessToken,
    password
  );

  if (!newAuthSession) {
    return json(
      { errors: { email: "invalid-email-password", password: null } },
      { status: 400 }
    );
  }

  console.log("password reset", newAuthSession);

  return refreshAuthSession(request);
};

export default function ResetPasswordPage(): JSX.Element {
  const actionData = useActionData<ActionData>();
  const errors = actionData?.errors;

  const passwordProps = useFormInputProps("password", {
    required: true,
    minLength: 8,
  });

  return (
    <div className="-mt-24 flex min-h-screen flex-col items-center justify-center py-2 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your password
          </h2>
        </div>
        <Form
          className="mt-8 space-y-6"
          method="post"
        >
          <input
            type="hidden"
            name="remember"
            value="true"
          />
          <div className="-space-y-px rounded-md shadow-sm">
            <>
              <label
                htmlFor="password"
                className="sr-only"
              >
                Password
              </label>
              <input
                {...passwordProps}
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Password"
              />
              {errors?.password && (
                <p
                  className="mt-2 text-sm text-red-600"
                  id="password-error"
                >
                  {errors.password}
                </p>
              )}
            </>
          </div>
          <button type="submit">Reset Password</button>
        </Form>
      </div>
    </div>
  );
}
