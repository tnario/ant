import Application from "./src/application.ts";

const app = new Application({ port: 8000 });

app.get(
  "/hello",
  async (req) => {
    console.log("lol");
  },
  async (req) => {
    console.log("lol 2");

    req.respond({});
  }
);

app.run();
