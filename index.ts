import Router from "./router.ts";
import Server from "./server.ts";

const router = new Router();

router.get("/", async (req) => {
  req.respond({
    status: 200,
    body: "Hello root!",
  });
});

router.get("/hello/:id", async (req, params, q) => {
  console.log(params);
  console.log(q);

  req.respond({
    status: 200,
    body: "Hello World!",
  });
});

router.post("/", async (req) => {
  req.respond({
    status: 200,
    body: "Hello POST root!",
  });
});

const server = new Server();

server.useRouter("/", router).run("localhost:8080");
