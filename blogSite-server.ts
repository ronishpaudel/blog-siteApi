import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();
const app = express();
var cors = require("cors");

app.use(cors());
app.use(express.json());
const Port = 3001;
app.get("/", (req, res) => {
  res.send("Hello,world");
});
app.listen(Port, () => {
  console.log(`Server up on port ${Port}`);
});
