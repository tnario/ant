import { serveHTTP, router, useRoutes } from "../mod.ts";
import { useErrorMiddleware, useMiddleware } from "../src/utilities.ts";

const [appRoutes, appRouteController] = useRoutes();
const [routerRoutes, routerRouteController] = useRoutes();

appRouteController.get("/", async (req, res) => {
  res.body = "hello world";
  res.send();
});

routerRouteController.get("/", async (req, res) => {
  res.body = "hello world 2";
  res.send();
});

const appMiddleware = useMiddleware(async (req, res) => {
  console.log("app hello");
});
const appErrorMiddleware = useErrorMiddleware(async (err, req, res) => {
  console.log(err);
});

serveHTTP({ port: 8000 }, () => console.log("http://localhost:8000"))(
  router("/hello")(routerRoutes)
)(appMiddleware, appRoutes, appErrorMiddleware);
