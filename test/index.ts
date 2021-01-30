import { Application, Router } from "../mod.ts";

const app = new Application();
const router = new Router();

router.use(async (req, res) => {
  console.log("router middle");
});

app.use(async (req, res, error) => {
  console.log("app middle");
  error(new Error("Oh No!"));
});

router.get(
  "/",
  async (req, res) => {
    console.log("hello");
  },
  async (req, res, end) => {
    console.log("world");
    end(1);
  }
);

app.error(async (err, req, res) => {
  console.log("ERROR 1");
  console.log(req.url, err);
  res
    .status(404)
    .send(JSON.stringify({ hello: "error" }))
    .json();
});

app.mount("/hello", router);

app.run({ port: 8000 }, () => {
  console.log("localhost:8000");
});
