import express, { Request, Response } from "express";
import nodeFetch from "node-fetch";
import path from "path";
import ejs from "ejs";
require("dotenv").config();

const app = express();
const port = 8080;

app.set("views", path.resolve(__dirname, "./views/"));
ejs.delimiter = "?";
app.engine("html", ejs.renderFile);
app.set("view engine", "html");

app.get("/", (req: Request, res: Response) => {
  res.render("index.ejs", {
    SITEKEY: process.env.RECAPTCHA_SITEKEY,
  });
});

app.get("/api", async (req: Request, res: Response) => {
  const token = req.query.token;
  const response = await nodeFetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${token}`,
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      method: "POST",
    },
  );
  const data = (await response.json()) as { success: boolean };

  if (!data?.success) {
    throw Error("recaptcha not solved");
  }

  res.send({ data });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
