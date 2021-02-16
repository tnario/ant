import { ServerRequest } from "http/server.ts";
import { encode } from "encoding/base64.ts";
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
  accepts: (mediaType: string) => boolean;
  basicAuth: (credentials: string) => boolean;
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

  // HTTP Accept Header Check
  const parsedAcceptHeader = (req.headers.get("accept") || "")
    .replaceAll(" ", "")
    .split(",")
    .map((x) => x.split(";")[0].toLowerCase());

  function accepts(mediaType: string) {
    return parsedAcceptHeader.includes(mediaType.toLowerCase());
  }

  // HTTP Authorization Header Check
  const authorizationHeader = req.headers.get("authorization");

  // Basic Auth
  function basicAuth(credentials: string) {
    if (!authorizationHeader) {
      throw new Error("Authorization Header Is Not Set In Request Context!");
    }
    const [type, cred] = authorizationHeader.split(" ");

    if (type.toLowerCase() !== "basic") {
      throw new Error("Authorization Header Is Not Of Type 'Basic'!");
    }

    return encode(credentials) === cred;
  }

  return {
    basicAuth,
    accepts,
    params,
    query,

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
