import fs from "node:fs";
import path from "node:path";
import { Routes, Route } from "react-router-dom";
import { StaticRouter } from "react-router-dom/server";
import { renderToString } from "react-dom/server";
import serverless from "@stormkit/serverless";
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

export const handler = serverless(async (req, res) => {
  const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf-8");
  const { status, content, head } = await render(
    req.url?.split(/\?#/)[0] || "/"
  );

  res.writeHead(status, "OK", { "Content-Type": "text/html" });
  res.write(
    html
      .replace("</head>", `${head}</head>`)
      .replace(`<div id="root"></div>`, `<div id="root">${content}</div>`)
  );
  res.end();
});
