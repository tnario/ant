export const transformPath = (path: string): string[] => {
  const output = ["/"];

  const re = /((?!\/).)+/g;

  return output.concat(path.match(re) || []);
};

export const getQueryParams = (qs: string): Record<string, string> => {
  const output: Record<string, string> = {};

  if (!qs) return output;

  for (const pair of qs.split("&")) {
    const [key, value] = pair.split("=");
    output[key] = value;
  }

  return output;
};

export const getPathParams = (path: string[], paramsMap: string[][]) => {
  const output: Record<string, string> = {};

  for (const [pos, name] of paramsMap) {
    output[name] = path[Number(pos)];
  }

  return output;
};

export const normalizePath = (
  path: string,
): [string[], string[][]] => {
  let pathSegments = ["/"];
  let paramsMap = [];
  const re = /((?!\/).)+/g;
  const segments = path.match(re) || [];

  for (let i = 0; i < segments.length; i++) {
    if (segments[i][0] === ":") {
      pathSegments.push("*");
      paramsMap.push([`${i + 1}`, segments[i].slice(1)]);
    } else {
      pathSegments.push(segments[i]);
    }
  }

  return [pathSegments, paramsMap];
};
