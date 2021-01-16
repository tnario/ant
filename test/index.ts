import { Application } from "../mod.ts";

const app = new Application({ port: 8000 });

app.useBefore(
  async (req, res, next) => {
    console.log("middle");
    next();
  },
  async (req, res, next) => {
    console.log("middle2");
    next();
  }
);

type params = { id: string };
type query = { qq: string };

app.get<params, query>(
  "/hello/:id",
  async (req, res, next) => {
    console.log(req.params.id);
    next();
  },
  async (req, res) => {
    console.log(req.query.qq);
    res
      .status(204)
      .set({ "Content-Type": "application/json" })
      .send(JSON.stringify({}));
  }
);

type body = { qqq: string; fref: number };

app.post<any, any, body>("/", async (req, res) => {
  const data = req.headers;
  console.log(data);

  res.send("");
});

app.run();
