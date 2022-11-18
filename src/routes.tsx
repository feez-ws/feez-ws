import type { RouteProps } from "react-router";
import Async from "~/components/Async";
import HomePage from "~/pages";

const chunks = [
  { path: "/my", chunk: () => import("~/pages/my") },
  { path: "/:name", chunk: () => import("~/pages/[name]") },
];

const routes: RouteProps[] = [{ path: "/", element: <HomePage /> }];

export default async () => {
  if (typeof window === "undefined") {
    for (const c of chunks) {
      const Element = (await c.chunk()).default;
      routes.push({ path: c.path, element: <Element /> });
    }
  } else {
    chunks.forEach((c) => {
      routes.push({ path: c.path, element: Async(c.chunk) });
    });
  }

  return routes;
};
