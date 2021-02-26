import { assert, assertEquals } from "testing/asserts.ts";
import { useRoutes } from "../mod.ts";
import { Route } from "../src/containers.ts";

Deno.test("UseRoutes: useRoutes() is factory function", () => {
  assertEquals(
    typeof useRoutes,
    "function",
    "useRoutes is not typeof 'function'"
  );

  assertEquals(
    typeof useRoutes([]),
    "object",
    "useRoutes() is not typeof 'object'"
  );
});

Deno.test(
  "UseRoutes: .get(...) exists and can insert GET Route to the container.",
  () => {
    const routeContainer: Route[] = [];
    const routeFactory = useRoutes(routeContainer);

    assert(routeFactory.get, ".get(...) does not exist!");

    routeFactory.get("/", async () => {});

    assertEquals(routeContainer.length, 1);
    assertEquals(routeContainer[0].method, "GET");
    assert(routeContainer[0].path);
    assert(routeContainer[0].callbacks);
    assertEquals(routeContainer[0].routerPath, undefined);
  }
);

Deno.test(
  "UseRoutes: .post(...) exists and can insert POST Route to the container.",
  () => {
    const routeContainer: Route[] = [];
    const routeFactory = useRoutes(routeContainer);

    assert(routeFactory.post, ".post(...) does not exist!");

    routeFactory.post("/", async () => {});

    assertEquals(routeContainer.length, 1);
    assertEquals(routeContainer[0].method, "POST");
    assert(routeContainer[0].path);
    assert(routeContainer[0].callbacks);
    assertEquals(routeContainer[0].routerPath, undefined);
  }
);

Deno.test(
  "UseRoutes: .delete(...) exists and can insert DELETE Route to the container.",
  () => {
    const routeContainer: Route[] = [];
    const routeFactory = useRoutes(routeContainer);

    assert(routeFactory.delete, ".delete(...) does not exist!");

    routeFactory.delete("/", async () => {});

    assertEquals(routeContainer.length, 1);
    assertEquals(routeContainer[0].method, "DELETE");
    assert(routeContainer[0].path);
    assert(routeContainer[0].callbacks);
    assertEquals(routeContainer[0].routerPath, undefined);
  }
);

Deno.test(
  "UseRoutes: .put(...) exists and can insert PUT Route to the container.",
  () => {
    const routeContainer: Route[] = [];
    const routeFactory = useRoutes(routeContainer);

    assert(routeFactory.put, ".put(...) does not exist!");

    routeFactory.put("/", async () => {});

    assertEquals(routeContainer.length, 1);
    assertEquals(routeContainer[0].method, "PUT");
    assert(routeContainer[0].path);
    assert(routeContainer[0].callbacks);
    assertEquals(routeContainer[0].routerPath, undefined);
  }
);

Deno.test(
  "UseRoutes: .connect(...) exists and can insert CONNECT Route to the container.",
  () => {
    const routeContainer: Route[] = [];
    const routeFactory = useRoutes(routeContainer);

    assert(routeFactory.connect, ".connect(...) does not exist!");

    routeFactory.connect("/", async () => {});

    assertEquals(routeContainer.length, 1);
    assertEquals(routeContainer[0].method, "CONNECT");
    assert(routeContainer[0].path);
    assert(routeContainer[0].callbacks);
    assertEquals(routeContainer[0].routerPath, undefined);
  }
);

Deno.test(
  "UseRoutes: .head(...) exists and can insert HEAD Route to the container.",
  () => {
    const routeContainer: Route[] = [];
    const routeFactory = useRoutes(routeContainer);

    assert(routeFactory.head, ".head(...) does not exist!");

    routeFactory.head("/", async () => {});

    assertEquals(routeContainer.length, 1);
    assertEquals(routeContainer[0].method, "HEAD");
    assert(routeContainer[0].path);
    assert(routeContainer[0].callbacks);
    assertEquals(routeContainer[0].routerPath, undefined);
  }
);

Deno.test(
  "UseRoutes: .options(...) exists and can insert OPTIONS Route to the container.",
  () => {
    const routeContainer: Route[] = [];
    const routeFactory = useRoutes(routeContainer);

    assert(routeFactory.options, ".options(...) does not exist!");

    routeFactory.options("/", async () => {});

    assertEquals(routeContainer.length, 1);
    assertEquals(routeContainer[0].method, "OPTIONS");
    assert(routeContainer[0].path);
    assert(routeContainer[0].callbacks);
    assertEquals(routeContainer[0].routerPath, undefined);
  }
);

Deno.test(
  "UseRoutes: .patch(...) exists and can insert PATCH Route to the container.",
  () => {
    const routeContainer: Route[] = [];
    const routeFactory = useRoutes(routeContainer);

    assert(routeFactory.patch, ".patch(...) does not exist!");

    routeFactory.patch("/", async () => {});

    assertEquals(routeContainer.length, 1);
    assertEquals(routeContainer[0].method, "PATCH");
    assert(routeContainer[0].path);
    assert(routeContainer[0].callbacks);
    assertEquals(routeContainer[0].routerPath, undefined);
  }
);

Deno.test(
  "UseRoutes: .trace(...) exists and can insert TRACE Route to the container.",
  () => {
    const routeContainer: Route[] = [];
    const routeFactory = useRoutes(routeContainer);

    assert(routeFactory.trace, ".trace(...) does not exist!");

    routeFactory.trace("/", async () => {});

    assertEquals(routeContainer.length, 1);
    assertEquals(routeContainer[0].method, "TRACE");
    assert(routeContainer[0].path);
    assert(routeContainer[0].callbacks);
    assertEquals(routeContainer[0].routerPath, undefined);
  }
);
