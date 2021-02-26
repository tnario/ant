import { assertEquals } from "testing/asserts.ts";
import { router } from "../mod.ts";

Deno.test("Router: router() returns RouterContainer", () => {
  const routerContainer = router("/")([]);

  assertEquals(routerContainer.prefix, "/");
  assertEquals(routerContainer.middleware.length, 0);
  assertEquals(routerContainer.routes.length, 0);
});
