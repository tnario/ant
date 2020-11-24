import Router from "./router.ts";
import Server from "./server.ts";

const router = new Router();

router.get("/hello/:id", async (req, params) => {
  console.log(params);

  req.respond({
    status: 200,
    body: "Hello World!",
  });
});

router.get("/", async (req) => {
  req.respond({
    status: 200,
    body: "Hello root!",
  });
});

const server = new Server();

server.useRouter("/", router).run("localhost:8080");
