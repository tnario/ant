import { Application, Router } from "../mod.ts";

const app = new Application();
const router = new Router();

app.use(async (req) => {
  console.log(req.ip);
});

app.get("/hello", async (req, res) => {
  res.connectionManagment
    .connection("keep-alive")
    .keepAlive("timeout=5, max=1000");

  const h = { g: 987, uu: "hjggj" };

  res.send(JSON.stringify(h)).json();
  console.log(res.headers.values());
});

app.runHTTP({ port: 8000 }, () => {
  console.log("http://localhost:8000");
});
