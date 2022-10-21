import type { LoaderFunction} from "@remix-run/node";
import {json} from "@remix-run/node";
import {Outlet} from "@remix-run/react";
import {requireAuthSession} from "~/modules/auth/guards";
import type {AuthSession} from "~/modules/auth/session.server";

type LoaderData = {
    authSession: AuthSession;
};

export const loader: LoaderFunction = async ({request}) => {
    const authSession = await requireAuthSession(request);
    return json<LoaderData>({authSession});
};

export default function LabTests(): JSX.Element {
    return (
        <div className="space-y-6 bg-gray-100">
            <Outlet/>
        </div>
    );
}
