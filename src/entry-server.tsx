import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Routes, Route } from "react-router-dom";
import { StaticRouter } from "react-router-dom/server";
import { renderToString } from "react-dom/server";
import serverless from "@stormkit/serverless";
import createRoutes from "./routes";

interface RenderReturn {
  status: number;
  content: string;
  head: string;
}

export type RenderFunction = (url: string) => Promise<RenderReturn>;

export const render: RenderFunction = async (url) => {
  const routes = await createRoutes();

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

export const handler = serverless(async (req: any, res: any) => {
  // We are in assets folder
  const dir = path.dirname(fileURLToPath(import.meta.url));
  const html = fs.readFileSync(path.join(dir, "./index.html"), "utf-8");

  const { status, content, head } = await render(
    req.url?.split(/\?#/)[0] || "/"
  );

  res.writeHead(status, "OK", { "Content-Type": "text/html; charset=utf-8" });
  res.write(
    html
      .replace("</head>", `${head}</head>`)
      .replace(`<div id="root"></div>`, `<div id="root">${content}</div>`)
  );
  res.end();
});
