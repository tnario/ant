import { Response } from "https://deno.land/std@0.83.0/http/server.ts";
import {
  Cookie,
  deleteCookie,
  setCookie,
} from "https://deno.land/std@0.83.0/http/cookie.ts";

export interface ResponseContext {
  headers: Headers;
  body: (d: Uint8Array | Deno.Reader | string) => void;
  redirect: (to: string, status: number) => void;
  send: (status?: number) => void;
  cookie: {
    set: (c: Cookie) => void;
    delete: (name: string) => void;
  };
}

export function createResponseContext(
  resRef: Response,
  done: boolean
): ResponseContext {
  const headers = new Headers();
  resRef.headers = headers;

  function body(d: Uint8Array | Deno.Reader | string) {
    resRef.body = d;
  }

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
    get headers() {
      return headers;
    },

    get cookie() {
      return {
        set: (c: Cookie) => setCookie(resRef, c),
        delete: (name: string) => deleteCookie(resRef, name),
      };
    },

    body,
    send,
    redirect,
  };
}
