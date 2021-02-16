import {
  createApplication,
  createRouter,
  MediaType,
  HttpHeader,
} from "../mod.ts";

const app = createApplication();
const router = createRouter();

app.static("/web/", "./test", { exts: ["html"] });

// router.use(async (req, res, err) => {
//   console.log("router-level handler");
// });

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
    res.headers.set(HttpHeader.ContentType, MediaType.TextHtml);
    res.send();
  }
);

router.get("/:id", async (req, res) => {
  res.redirect("https://tnario.github.io/deno-hyper-http/", 301);
});

app.group("/q", router);

app.error(async (err, req, res) => {
  console.log(err);

  res.body = err.message;
  res.send();
});

app.listenHTTP({ port: 8000 }, () => {
  console.log("Listening on port 8000");
});
