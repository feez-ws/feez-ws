import { fileURLToPath } from "node:url";
import path from "node:path";
import glob from "glob";
import { build } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const files = glob.sync("src/api/**/*.ts").map((file) => ({
  entry: `./${file}`,
  distFileName: file.replace("src/", "").replace(".ts", ""),
}));

files.forEach(async (file) => {
  await build({
    configFile: false,
    resolve: {
      alias: [
        {
          find: /^~/,
          replacement: path.resolve(__dirname, "src"),
        },
      ],
      extensions: [".ts", ".tsx"],
    },
    build: {
      lib: {
        entry: { [file.distFileName]: file.entry },
        formats: ["cjs"],
      },
      outDir: ".stormkit",
    },
  });
});
