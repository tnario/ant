![hyper-http-logo-svg](assets/deno-hyper-http.svg)

_An enhanced and lightweight HTTP web server._

# About hyper-http

It is a lightweight HTTP web server framework, that wraps around the standard Deno [http](https://deno.land/std@0.87.0/http) module.

hyper-http is scalable and provides a user-friendly API for controlling the state of the application.

The project is under MIT license, you can view it [here](LICENSE.md).

hyper-http features include:

- Routers
- Type Persistance
- Middlewares

# Guide

## Hello World

Import `createApplication` and create an instance of `Application`. Define the routes using `Application.[METHOD]` and run your web application with `Application.listenHTTP` or `Application.listenHTTPS`.

```ts
import { createApplication } from "https://deno.land/x/hyper-http@v0.1.1/mod.ts";

const app = createApplication();

app.get(
  "/",
  async (req, res) => {
    console.log("handler 1");
  },
  async (req, res) => {
    console.log("handler 2");

    res.body("hello world!");
    res.send();
  }
);

app.listenHTTP({ port: 8000 }, () => {
  console.log("Listening on port 8000");
});
```

## Using Routers

When building a large web app, having your routes defined in one place is redundant. To break up and/or group your routes, use `Router` and then mount it to the `Application` by using `Application.group`

```ts
// router.ts

import { createRouter } from "https://deno.land/x/hyper-http@v0.1.1/mod.ts";

const router = createRouter();

router.get(
  "/",
  async (req, res) => {
    console.log("handler 1");
  },
  async (req, res) => {
    console.log("handler 2");

    res.body("hello world!");
    res.send();
  }
);

export default router;
```

```ts
// index.ts

import { createApplication } from "https://deno.land/x/hyper-http@v0.1.1/mod.ts";
import router from "./router.ts";

const app = createApplication();

app.group("/", router);

app.run({ port: 8000 }, () => {
  console.log("Listening on port 8000");
});
```

## Route Workflow

Each route holds an array of handlers that process the request. These handlers are executed one by one until the last handler has been reached. If the response is not sent or an error is not thrown, the server will send a default response payload with `status: 200` and an empty `body`.

## Making Routes Type Consistent

When defining routes using `Application.[METHOD]` or `Router.[METHOD]`, there is an option to declare generic types for `RequestContext.params`, `RequestContext.query` and `RequestContext.body` that will persist throughout all route handlers.

**_type params_**

P - corresponds to `RequestContext.params` types.

Q - corresponds to `RequestContext.query` types.

B - corresponds to `RequestContext.body` types (_only works when body is in JSON format_)

```ts
type ReqParams = {
  id: string,
  foo: string,
  bar: string,
};

type ReqQuery = {
  name: string,
};

router.get<P = ReqParams, Q = ReqQuery>(
  "/:id/:foo/:bar",
  async (req, res) => {
    console.log("handler 1");
  },
  async (req, res) => {
    console.log("handler 2");

    res.body("hello world!");
    res.send();
  }
);
```

## Error handling

When an error is thrown using either `error()` or `throw` keyword the **hyper-http application** will stop executing the route handlers and go straight to error handling process.

By default **hyper-http application** DOES NOT know how to handle errors. Error handling NEEDS to be defined by the developer using `Application.error`.

### Throwing Errors

As mentioned before, there are two ways of throwing an error:

Using `throw` keyword:

```ts
app.get("/", async (req, res) => {
  throw new Error("Opps!"); // this will be cought

  res.status(200).send("hello world!");
});
```

Or using `error()` function:

```ts
app.get("/", async (req, res, error) => {
  error(new Error("Opps!")); // this will be cought

  res.status(200).send("hello world!");
});
```

> IMPORTANT: you don't need to use `try...catch` blocks for each route handler,
> unless you are doing asynchronous work.

### Defining Error Handling Process

By default if the error handler does not send back a response using `res.send`, the **hyper-http application** will send a default error response payload with `status: 500` and an empty `body`.

```ts
app.error(
  async (err, req, res) => {
    console.log(req.url, err); // Error logging
  },
  async (err, req, res) => {
    const response = {
      message: err.message,
    };

    // Send a response back to client with an error
    res.status(500).send(JSON.stringify(response)).json();
  }
);
```

# API Reference

## Application

### Application.METHOD(path: string, ...steps: Callback[])

Defines a HTTP route, where `METHOD` is one of supported HTTP methods

### Application.group(path: string, router: Router)

Mounts `Router` and its contents to the `Application`.

### Application.error(...handlers)

Used to define the error handling process.

### Application.use(...handlers)

Used to define Application-Level handlers.

### Application.runHTTP(addr: string | HTTPOptions, cb?: () => void)

Starts a **HTTP** web server process with the specified address `addr` and an optional callback `cb` function, that is executed before the web server process.

### Application.runHTTPS(addr: HTTPSOptions, cb?: () => void)

Starts a **HTTPS** web server process with the specified address `addr` and an optional callback `cb` function, that is executed before the web server process.

---

## Router

### Router.METHOD(path: string, ...Callback[])

Defines a HTTP route, where `METHOD` is one of HTTP methods (GET, POST, DELETE, PUT, ...)

### Router.use(...handlers)

Used to define Router-Level handlers.

---

## RequestContext

Holds information about the request.

**The supported properties of `RequestContext` are:**

### get url(): string

returns a string that represents the endpoint of a request.

```bash
# full path
http://localhost:8000/customers

# RequestCtx.url output:
/customers
```

### get method(): string

returns a string that represents the HTTP method that was used for the request.

### get ip(): string

returns a string that represents the IP address of the server.

### get headers(): Header

returns a `Header` object which holds and/or manipulates the headers of a request.

### get body()

contains key-value pairs of data that was submitted in the request. The `.body` returns properties that return the `body` of the request in a specific format. The supported formats are:

| Getter | Return Type           |
| ------ | --------------------- |
| _json_ | Promise<_Object_>     |
| _text_ | Promise<_string_>     |
| _raw_  | Promise<_Uint8Array_> |

---

## ResponseContext

Holds and controls the response data, that can be sent back to the client.

### get cookie()

Returns two methods for setting and deleting cookies.

- set(c: Cookie): void
- delete(name: string): void

### body(d: Uint8Array | Deno.Reader | string) => void

Sets the response `body`

### send(status?: number) => void

Sends the response payload back to the client.

### get headers()

returns `Header` object.

### redirect(to: string, status: number) => void

sends a response payload with redirection header backt to the client.
