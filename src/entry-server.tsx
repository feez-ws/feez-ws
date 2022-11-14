import { Routes, Route } from "react-router-dom";
import { StaticRouter } from "react-router-dom/server";
import { renderToString } from "react-dom/server";
import routes from "./routes";

interface RenderReturn {
  status: number;
  content: string;
  head: string;
}

export const render = async (url: string): Promise<RenderReturn> => {
  return {
    status: 200,
    content: renderToString(
      <StaticRouter location={url}>
        <Routes>
          {routes.map((r) => (
            <Route key={r.path} {...r} />
          ))}
        </Routes>
      </StaticRouter>
    ),
    head: "<title>Hello world</title>",
  };
};
