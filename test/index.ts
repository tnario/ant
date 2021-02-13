import { createApplication, createRouter } from "../mod.ts";
import { ContentTypes, HttpHeaders } from "../src/constants.ts";

const app = createApplication();
const router = createRouter();

// console.log(app);

router.use(async (req, res, err) => {
  console.log("router-level handler");
});

app.use(async (req, res) => {
  console.log("app-level handler");
});

router.get(
  "/",
  async (req, res, err) => {
    console.log(req.ip);

    console.log("route-level handler");
  },
  async (req, res) => {
    const doc = await Deno.readFile("./test/doc.html");
    res.headers.set(HttpHeaders.ContentType, ContentTypes.textHtml);
    res.body(doc);
    res.send();
  }
);

router.get("/:id", async (req) => {
  console.log(req.params.id);
});

app.group("/", router);

app.error(async (err, req, res) => {
  console.log(err);

  res.body(err.message);
  res.send();
});

app.listenHTTP({ port: 8000 }, () => {
  console.log("Listening on port 8000");
});
