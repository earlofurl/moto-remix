import { Outlet } from "@remix-run/react";
import BackendDash from "~/components/layout/BackendDash";

export default function Admin(): JSX.Element {
  return (
    <div>
      <BackendDash />
    </div>
  );
}
