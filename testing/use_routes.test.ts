import { assert, assertEquals } from "testing/asserts.ts";
import { useRoutes } from "../mod.ts";

Deno.test(
  "UseRoutes: .get(...) exists and can insert GET Route to the container.",
  () => {
    const [routeContainer, routeController] = useRoutes();

    assert(routeController.get, ".get(...) does not exist!");

    routeController.get("/", async () => {});

    assertEquals(routeContainer.length, 1);
    assertEquals(routeContainer[0].method, "GET");
    assert(routeContainer[0].path);
    assert(routeContainer[0].callbacks);
    assertEquals(routeContainer[0].routerPath, undefined);
  }
);

Deno.test(
  "UseRoutes: .add(...) exists and can insert ANY HTTP Route to the container.",
  () => {
    const [routeContainer, routeController] = useRoutes();

    assert(routeController.add, ".add(...) does not exist!");

    routeController.add("GET", "/", async () => {});

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
    const [routeContainer, routeController] = useRoutes();

    assert(routeController.post, ".post(...) does not exist!");

    routeController.post("/", async () => {});

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
    const [routeContainer, routeController] = useRoutes();

    assert(routeController.delete, ".delete(...) does not exist!");

    routeController.delete("/", async () => {});

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
    const [routeContainer, routeController] = useRoutes();

    assert(routeController.put, ".put(...) does not exist!");

    routeController.put("/", async () => {});

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
    const [routeContainer, routeController] = useRoutes();

    assert(routeController.connect, ".connect(...) does not exist!");

    routeController.connect("/", async () => {});

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
    const [routeContainer, routeController] = useRoutes();

    assert(routeController.head, ".head(...) does not exist!");

    routeController.head("/", async () => {});

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
    const [routeContainer, routeController] = useRoutes();

    assert(routeController.options, ".options(...) does not exist!");

    routeController.options("/", async () => {});

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
    const [routeContainer, routeController] = useRoutes();

    assert(routeController.patch, ".patch(...) does not exist!");

    routeController.patch("/", async () => {});

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
    const [routeContainer, routeController] = useRoutes();

    assert(routeController.trace, ".trace(...) does not exist!");

    routeController.trace("/", async () => {});

    assertEquals(routeContainer.length, 1);
    assertEquals(routeContainer[0].method, "TRACE");
    assert(routeContainer[0].path);
    assert(routeContainer[0].callbacks);
    assertEquals(routeContainer[0].routerPath, undefined);
  }
);
