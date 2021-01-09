export function parseRoute(path: string): [string[], Record<number, string>] {
  const pathSegments = [
    "/",
    ...path
      .split("/")
      .filter((x) => x !== "")
      .map((x) => x.replaceAll(" ", "")),
  ];

  const validPath = pathSegments.map((x) => (x[0] === ":" ? "*" : x));
  const pathParams: Record<number, string> = {};

  for (let i = 0; i < pathSegments.length; i++) {
    const seg = pathSegments[i];
    if (seg[0] === ":") {
      pathParams[i] = seg.replace(":", "");
    }
  }

  return [validPath, pathParams];
}

export function parseQueryString(query: string) {
  return query
    .split("&")
    .map((x) => x.split("="))
    .reduce<Record<string, string>>((acc, [k, v]) => {
      acc[k] = v;
      return acc;
    }, {});
}
