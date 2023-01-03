import type { RenderFunction } from "./entry-server";
import fs from "fs";
import path from "path";
import express from "express";
import { fileURLToPath } from "node:url";
import { createServer as createViteServer } from "vite";
import { matchPath } from "@stormkit/serverless/router";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function injectContent(head: string, content: string, template: string) {
  return template
    .replace(`</head>`, `${head}</head>`)
    .replace(`<div id="root"></div>`, `<div id="root">${content}</div>`);
}

async function createServer() {
  const app = express();

  // Create Vite server in middleware mode and configure the app type as
  // 'custom', disabling Vite's own HTML serving logic so parent server
  // can take control
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
  });

  // use vite's connect instance as middleware
  // if you use your own express router (express.Router()), you should use router.use
  app.use(vite.middlewares);

  // TODO (SK): This could be a middleware
  app.all(/\/api(\/.*|$)/, async (req, res) => {
    const route = matchPath(
      path.join(__dirname, "api"),
      req.originalUrl.split(/\?|#/)[0].replace("/api", ""),
      req.method
    );

    if (!route) {
      res.status(404);
      res.send();
      return;
    }

    const handler = (await vite.ssrLoadModule(`/src/api/${route}`)) as {
      default: express.Handler;
    };

    handler.default(req, res, () => {});
  });

  app.get("*", async (req, res, next) => {
    try {
      const url: string = req.originalUrl.split(/\?#/)[0] || "/";

      // // 1. Read and apply Vite HTML transforms. This injects the Vite HMR client, and
      // //    also applies HTML transforms from Vite plugins, e.g. global preambles
      // //    from @vitejs/plugin-react
      const template: string = await vite.transformIndexHtml(
        req.originalUrl,
        fs.readFileSync(path.resolve(__dirname, "..", "index.html"), "utf-8")
      );

      // 2. Load the server entry. vite.ssrLoadModule automatically transforms
      //    your ESM source code to be usable in Node.js! There is no bundling
      //    required, and provides efficient invalidation similar to HMR.
      const { render } = (await vite.ssrLoadModule("./src/entry-server")) as {
        render: RenderFunction;
      };

      const rendered = await render(url);

      return res
        .status(rendered.status)
        .set({ "Content-Type": "text/html" })
        .send(injectContent(rendered.head, rendered.content, template));
    } catch (e) {
      // If an error is caught, let Vite fix the stack trace so it maps back to
      // your actual source code.
      if (e instanceof Error) {
        vite.ssrFixStacktrace(e);
      }

      next(e);
    }
  });

  app.listen(5173, () => {
    console.log(`Server listening on http://localhost:5173`);
  });
}

async function generateStaticPages() {
  const routesToPrerender = ["/", "/my"];

  // Create Vite server to load the routes files
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
  });

  const { render } = (await vite.ssrLoadModule("./src/entry-server.tsx")) as {
    render: RenderFunction;
  };

  const dist = path.join(path.dirname(__dirname), ".stormkit/public");
  const template = fs.readFileSync(path.join(dist, "/index.html"), "utf-8");

  let manifest: Record<string, any>;

  try {
    manifest = JSON.parse(
      fs.readFileSync(path.join(dist, "..", "server", "manifest.json"), "utf-8")
    );
  } catch {
    throw new Error(
      "Cannot parse manifest.json file. Did you run npm run build:ssr?"
    );
  }

  for (const r of routesToPrerender) {
    const data = await render(r);
    const fileName = r.endsWith("/") ? `${r}index.html` : `${r}.html`;
    const absPath = path.join(dist, fileName);
    let content = injectContent(data.head, data.content, template);

    Object.keys(manifest)
      .filter((key) => key.startsWith("src/assets"))
      .forEach((key: string) => {
        content = content.replaceAll(
          `/${key}`,
          `/${manifest[key]?.assets?.[0]}`
        );
      });

    fs.writeFileSync(absPath, content, "utf-8");

    console.log(`Prerendered: ${fileName}`);
  }

  await vite.close();
}

(async () => {
  if (process.env.SSG === "true") {
    console.info("Detected SSG=true - generating static routes...");
    await generateStaticPages();
  } else {
    createServer();
  }
})();
