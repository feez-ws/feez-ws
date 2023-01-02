import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { StaticRouter } from "react-router-dom/server";
import { renderToString } from "react-dom/server";
import serverless from "@stormkit/serverless";
import createRoutes from "./routes";
import App from "./App";

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
        <App routes={routes} />
      </StaticRouter>
    ),
    head: `<title>Feez.ws | Track your progress in public</title>`,
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
