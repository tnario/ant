import { Application, Router } from "../mod.ts";

const app = new Application();
const router = new Router();

app.use(async (req) => {
  console.log(req.ip);
});

app.get("/hello", async () => {
  console.log("hello");
});

app.runHTTP({ port: 8000 }, () => {
  console.log("http://localhost:8000");
});
