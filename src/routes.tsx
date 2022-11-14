import type { RouteProps } from "react-router";
import Async from "~/components/Async";
import HomePage from "~/pages";

const routes: RouteProps[] = [
  { path: "/", element: <HomePage /> },
  { path: "/my", element: Async(() => import("~/pages/my")) },
  { path: "/:name", element: Async(() => import("~/pages/[name]")) },
];

export default routes;
