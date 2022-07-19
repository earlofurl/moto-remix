import { Outlet } from "@remix-run/react";

export default function Admin(): JSX.Element {
  return (
    <div>
      <Outlet />
    </div>
  );
}
