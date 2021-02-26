import { ServerRequest } from "http/server.ts";
import { getCookies } from "http/cookie.ts";

export interface RequestContext<
  P = Record<string, string>,
  Q = Record<string, string>,
  B = any
> {
  params: P;
  query: Q;
  body: {
    json: B;
    text: string;
    raw: Uint8Array;
  };
  ip: string;
  proto: string;
  protoMajor: number;
  protoMinor: number;
  cookies: Record<string, string>;
  url: string;
  method: string;
  headers: Headers;
  contentType: string | null;
  accept: (mediaType: string) => boolean;
}

export async function createRequestContext(
  req: ServerRequest,
  params: Record<string, string>,
  query: Record<string, string>
): Promise<RequestContext> {
  const rbody = await Deno.readAll(req.body);

  const decoder = new TextDecoder();

  const getJsonBody = (d: Uint8Array): any => JSON.parse(decoder.decode(d));

  const getTextBody = (d: Uint8Array) => decoder.decode(d);

  const acceptHeader = req.headers.get("accept") || "";

  const mediaTypes = acceptHeader
    .replaceAll(" ", "")
    .split(",")
    .map((x) => x.split(";")[0].split("/"))
    .reduce<Record<string, string[]>>((a, [type, subtype]) => {
      if (a[type] === undefined) a[type] = [];
      a[type].push(subtype);
      return a;
    }, {});

  function accept(mediaType: string) {
    if (acceptHeader === "") return false;
    if (acceptHeader.indexOf("*/*") !== -1) return true;

    const [type, subtype] = mediaType.split("/");

    if (mediaTypes[type] === undefined) return false;
    if (mediaTypes[type].indexOf("*") !== -1) return true;
    if (mediaTypes[type].indexOf(subtype) !== -1) return true;

    return false;
  }

  return {
    accept,
    params,
    query,

    get contentType() {
      return req.headers.get("content-type");
    },

    get ip() {
      return (req.conn.remoteAddr as Deno.NetAddr).hostname;
    },

    get proto() {
      return req.proto;
    },

    get protoMajor() {
      return req.protoMajor;
    },

    get protoMinor() {
      return req.protoMinor;
    },

    get cookies() {
      return getCookies(req);
    },

    get url() {
      return req.url;
    },

    get method() {
      return req.method;
    },

    get headers() {
      return req.headers;
    },

    get body() {
      return {
        get json() {
          return getJsonBody(rbody);
        },
        get text() {
          return getTextBody(rbody);
        },
        get raw() {
          return rbody;
        },
      };
    },
  };
}
