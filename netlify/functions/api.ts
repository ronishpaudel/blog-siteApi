import express, { Router } from "express";
import serverless from "serverless-http";
import { userRoute } from "../../resources/users";
import { blogRoute } from "../../blogSite-server";

const app = express();

app.get("/hello", (req, res) => res.send("Hello World!"));

app.use(userRoute);
app.use(blogRoute);

export const handler = serverless(app);
