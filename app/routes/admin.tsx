import type {ItemType, Uom} from "@prisma/client";
import type {LoaderFunction} from "@remix-run/node";
import {json} from "@remix-run/node";
import BackendDash from "~/components/layout/BackendDash";
import {requireAuthSession} from "~/modules/auth/guards";
import type {AuthSession} from "~/modules/auth/session.server";
import {getAllItemTypes} from "~/modules/itemType/queries/get-item-types.server";
import {getAllUoms} from "~/modules/uom/queries/get-uoms.server";

type LoaderData = {
    authSession: AuthSession;
    uoms: Uom[];
    itemTypes: ItemType[];
};

export const loader: LoaderFunction = async ({request}) => {
    const authSession = await requireAuthSession(request, {
        onFailRedirectTo: "/login",
    });
    const itemTypes = await getAllItemTypes();
    const uoms = await getAllUoms();

    return json<LoaderData>({authSession, itemTypes, uoms});
};

export default function Admin(): JSX.Element {
    return (
        <div>
            <BackendDash/>
        </div>
    );
}
