# **_Ant_**

Fast, simple and versatile web server framework.

> NOTE: This is NOT production ready yet!
> Test it out and give me some feedback :)

# Table Of Contents

- [**_Ant_**](#ant)
- [Table Of Contents](#table-of-contents)
- [**About**](#about)
  - [The Goal](#the-goal)
- [**Guide**](#guide)
  - [Hello World](#hello-world)
  - [Using Routers](#using-routers)
  - [Route Workflow](#route-workflow)
  - [Making Routes Type Consistent](#making-routes-type-consistent)
  - [Error handling](#error-handling)
    - [Throwing Errors](#throwing-errors)
    - [Defining Error Handling Process](#defining-error-handling-process)
- [**API Reference**](#api-reference)
  - [Application](#application)
    - [`Application.METHOD`](#applicationmethodpath-string-steps-callback)
    - [`Application.mount(path: string, router: Router)`](#applicationmountpath-string-router-router)
    - [`Application.error(...handlers)`](#applicationerrorhandlers)
    - [`Application.use(...handlers)`](#applicationusehandlers)
    - [`Application.run(addr: string | HTTPOptions, cb?: () => void)`](#applicationrunaddr-string--httpoptions-cb---void)
  - [Router](#router)
    - [`Router.METHOD`](#routermethodpath-string-callback)
  - [RequestCtx](#requestctx)
    - [**_url: string_**](#url-string)
    - [**_method: string_**](#method-string)
    - [**_headers: string_**](#headers-string)
    - [**_body_**](#body)
  - [ResponseCtx](#responsectx)
    - [_status(code: number)_](#statuscode-number)
    - [_set(...headers: string, string)_](#setheaders-string-string)
    - [_cookie(c: Cookie)_](#cookiec-cookie)
    - [_send(d: Uint8Array | Deno.Reader | string)_](#sendd-uint8array--denoreader--string)

# **About**

**Ant** is a web server framework wrapping around the standart Deno http library with zero 3rd party dependencies.

## The Goal

To provide a framework that gives full control of the application state to the developer, has a wide range of standartized tools and a simple to use interface for building complex web apps.

# **Guide**

## Hello World

Import and create an instance of `Application`. Define the routes using `Application.[METHOD]` and run your web application with `Application.run`

```ts
import { Application } from "https://deno.land/x/ant@v0.1.1/mod.ts";

const app = new Application();

app.get(
  "/",
  async (req, res) => {
    console.log("handler 1");
  },
  async (req, res) => {
    console.log("handler 2");

    res.status(200).send("hello world!").text();
  }
);

app.run({ port: 8000 }, () => {
  console.log("Listening on port 8000");
});
```

## Using Routers

When building a large web app, having your routes defined in one place is redundant. To break up and/or group your routes, use `Router` and then mount it to the `Application` by using `Application.mount`

```ts
// router.ts

import { Router } from "https://deno.land/x/ant@v0.1.1/mod.ts";

const router = new Router();

router.get(
  "/",
  async (req, res) => {
    console.log("middleware 1");
  },
  async (req, res) => {
    console.log("middleware 2");

    res.status(200).send("hello world!");
  }
);

export default router;
```

```ts
// index.ts

import { Application } from "https://deno.land/x/ant@v0.1.1/mod.ts";
import router from "./router.ts";

const app = new Application();

app.mount("/", router);

app.run({ port: 8000 }, () => {
  console.log("Listening on port 8000");
});
```

## Route Workflow

Each route holds an array of handlers that process the request. These handlers are executed one by one until the last handler has been reached. If the response is not sent or an error is not thrown, the server will send a default response payload with `status: 200` and an empty `body`.

## Making Routes Type Consistent

When defining routes using `Application.[METHOD]` or `Router.[METHOD]`, there is an option to declare generic types for `RequestCtx.params`, `RequestCtx.query` and `RequestCtx.body` that will persist throughout all route handlers.

**_type params_**

P - corresponds to `RequestCtx.params` types.

Q - corresponds to `RequestCtx.query` types.

B - corresponds to `RequestCtx.body` types.

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

    res.status(200).send("hello world!");
  }
);
```

## Error handling

When an error is thrown using either `error()` or `throw` keyword the **Ant application** will stop executing the route handlers and go straight to error handling process.

By default **Ant application** DOES NOT know how to handle errors. Error handling NEEDS to be defined by the developer using `Application.error`.

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

By default if the error handler does not send back a response using `res.send`, the **Ant application** will send a default error response payload with `status: 500` and an empty `body`.

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

# **API Reference**

## Application

### `Application.[METHOD](path: string, ...steps: Callback[])`

Defines a HTTP route, where `METHOD` is one of supported HTTP methods

---

### `Application.mount(path: string, router: Router)`

Mounts `Router` and its contents to the `Application`.

---

### `Application.error(...handlers)`

Used to define the error handling process.

---

### `Application.use(...handlers)`

Used to define Application-Level handlers.

---

### `Application.run(addr: string | HTTPOptions, cb?: () => void)`

Starts the web server process with the specified address `addr` and an optional callback `cb` function that is executed before the web server process.

---

## Router

### `Router.[METHOD](path: string, ...Callback[])`

Defines a HTTP route, where `METHOD` is one of HTTP methods (GET, POST, DELETE, PUT, ...)

## RequestCtx

Holds information about the incoming request.

**The supported properties of `RequestCtx` are:**

### **_url: string_**

`RequestCtx.url` returns a string that represents the endpoint of a request.

```bash
# full path
http://localhost:8000/customers

# RequestCtx.url output:
/customers
```

---

### **_method: string_**

`RequestCtx.method` returns a string that represents the HTTP method that was used for the request.

---

### **_headers: string_**

`RequestCtx.headers` returns a `Header` object which holds and/or manipulates the headers of a request.

---

### **_body_**

`RequestCtx.body` contains key-value pairs of data that was submitted in the request. The `RequestCtx.body` returns getter properties that return the `body` of the request in a specific format. The supporter formats are:

| Getter | Return Type           |
| ------ | --------------------- |
| _json_ | Promise<_Object_>     |
| _text_ | Promise<_string_>     |
| _raw_  | Promise<_Uint8Array_> |

---

## ResponseCtx

Holds and controls the response data, that can be sent back to the client.

### _status(code: number)_

Sets the status code of the response.

---

### _set(...headers: [string, string][])_

Sets headers of the response.

---

### _cookie(c: Cookie)_

Sets a cookie to the response object.

---

### _send(d: Uint8Array | Deno.Reader | string)_

Sets the response `body` and sends it to the client. To send the response body in a specific format `.send()` exports few methods for that:

| Method                    | Description                                      |
| ------------------------- | ------------------------------------------------ |
| json()                    | Sets `content-type` header to `application/json` |
| text()                    | Sets `content-type` header to `text/plain`       |
| type(contentType: string) | Sets `content-type` header to `contentType`      |

---
