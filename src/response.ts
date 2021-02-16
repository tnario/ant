import { Response } from "http/server.ts";
import { Cookie, deleteCookie, setCookie } from "http/cookie.ts";

export interface ResponseContext {
  headers: Headers;
  body: Uint8Array | Deno.Reader | string;
  redirect: (to: string, status: number) => void;
  send: (status?: number) => void;
  cookie: {
    set: (c: Cookie) => void;
    delete: (name: string) => void;
  };
  contentType: string;
}

export function createResponseContext(
  resRef: Response,
  done: boolean
): ResponseContext {
  const headers = new Headers();
  resRef.headers = headers;

  function redirect(to: string, status: number) {
    if (!(status >= 300 && status < 400)) {
      throw new Error("Status code has to be 3xx!");
    }

    resRef.status = status;
    headers.set("Location", to);

    done = true;
  }

  function send(status?: number) {
    status && (resRef.status = status);
    done = true;
  }

  return {
    set contentType(mediaType: string) {
      headers.set("content-type", mediaType);
    },

    get headers() {
      return headers;
    },

    get cookie() {
      return {
        set: (c: Cookie) => setCookie(resRef, c),
        delete: (name: string) => deleteCookie(resRef, name),
      };
    },

    set body(d: Uint8Array | Deno.Reader | string) {
      resRef.body = d;
    },
    send,
    redirect,
  };
}
