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
  const tags = {
    title: "Track your progress in public",
    description:
      "Create goals, measure your progress and share the steps to success with your audience.",
    twitter: {
      card: "summary",
      creator: "@savasvedova",
    },
  };

  return {
    status: 200,
    content: renderToString(
      <StaticRouter location={url}>
        <App routes={routes} />
      </StaticRouter>
    ),
    head: `
      <title>Feez | ${tags.title}</title>
      <meta name="description" content="${tags.description}" />
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="Feez | ${tags.title}" />
      <meta property="og:url" content="https://www.feez.ws/" />
      <meta property="og:description" content="${tags.description}" />
      <meta name="twitter:card" content="${tags.twitter!.card}" />
      <meta name="twitter:creator" content="${tags.twitter!.creator}" />
    `.trim(),
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
