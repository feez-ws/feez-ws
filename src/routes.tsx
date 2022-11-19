import type { RouteProps } from "react-router";
import Async from "~/components/Async";
import HomePage from "~/pages";

const routes = [
  { path: "/", element: <HomePage /> },
  { path: "/my", chunk: () => import("~/pages/my") },
  { path: "/:name", chunk: () => import("~/pages/[name]") },
];

const isServerSide = typeof window === "undefined";

export default async (): Promise<RouteProps[]> => {
  const val: RouteProps[] = [];

  for (const r of routes) {
    const route: RouteProps = { path: r.path, element: r.element };

    if (r.chunk && isServerSide) {
      const Element = (await r.chunk()).default;
      route.element = <Element />;
    } else if (r.chunk) {
      route.element = Async(r.path, r.chunk);
    }

    val.push(route);
  }

  return val;
};
