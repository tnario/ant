import { Application, Router } from "../mod.ts";

const app = new Application();
const router = new Router();

router.use(async (req, res) => {
  console.log("router middle");
});

app.use(async (req, res) => {
  console.log("app middle");
});

router.get(
  "/:id/:name",
  async (req, res) => {
    console.log(req.params);
  },
  async (req, res, error) => {
    try {
      const text = await Deno.readTextFile("./test/doc.html");
      const d = new TextEncoder().encode(text);
      res.status(200).send(d).type("text/html");
    } catch (e) {
      error(e);
    }
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
