import { walkSync } from "fs/mod.ts";
import { MediaType } from "./constants.ts";
import { useRoutes } from "./use_routes.ts";

type StaticOptions = {
  exts?: string[];
};

export function generateStaticFileRoutes(
  prefix: string,
  rootDir: string,
  options?: StaticOptions
) {
  const [routesList, routesController] = useRoutes();
  const fileStack = options
    ? walkSync(rootDir, { exts: options.exts })
    : walkSync(rootDir);

  const mediaTypes: Record<string, string> = {
    html: MediaType.TextHtml,
    css: MediaType.TextCss,
    js: MediaType.TextJavascript,
    txt: MediaType.TextPlain,
    json: MediaType.ApplicationJson,
  };

  for (const f of fileStack) {
    if (f.isDirectory) continue;

    const path = [prefix, f.path.replace(rootDir.replace("./", ""), "")].join(
      ""
    );

    routesController.get(path, async (req, res) => {
      const [_, ext] = f.name.split(".");
      const document = await Deno.readFile(f.path);

      res.contentType = mediaTypes[ext] || MediaType.TextPlain;
      res.body = document;
      res.send(200);
    });
  }

  return routesList;
}
