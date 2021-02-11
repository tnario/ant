import { Application, Router, ConnectionManagmentHeaders } from "../mod.ts";

const app = new Application();
const router = new Router();

router.use(async (req, res) => {
  console.log("router-level handler");
});

app.use(async (req, res) => {
  console.log("app-level handler");
});

router.get(
  "/",
  async (req, res, err) => {
    console.log("route-level handler");
  },
  async (req, res) => {
    const doc = await Deno.readFile("./test/doc.html");

    res.status(200).send(doc).html();
  }
);

app.group("/", router);

app.runHTTP({ port: 8000 }, () => {
  console.log("Listening on port 8000");
});
