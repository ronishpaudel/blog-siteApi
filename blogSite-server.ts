import express from "express";
import { PrismaClient } from "@prisma/client";
import { userRoute } from "./resources/users";

const prisma = new PrismaClient();

const app = express();
var cors = require("cors");

app.use(cors());
app.use(express.json());
const Port = 3001;

app.use(userRoute);

app.get("/", (req, res) => {
  res.send("Hello,world");
});
app.get("/blogs", async (req, res) => {
  const currentPage = Number(req.query.page) || 1;
  const pageSize = Number(req.query.page_size) || 10;
  const offset = pageSize * (currentPage - 1);
  const searchVal = req.query.q;
  try {
    if (!searchVal) {
      const posts = await prisma.post.findMany({
        skip: offset,
        take: pageSize,
        select: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          title: true,
          description: true,
          imageUrl: true,
          id: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      res.json(posts);
    } else {
      const posts = await prisma.post.findMany({
        skip: offset,
        take: pageSize,
        select: {
          category: true,
        },
        where: {
          title: {
            contains: String(searchVal),
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      res.json(posts);
    }
  } catch (e) {
    res.status(404).send("Not Found");
  }
});

app.get("/blogs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const posts = await prisma.post.findUnique({
      where: {
        id: Number(id),
      },
    });
    res.json(posts);
  } catch (e) {
    res.status(404).send("there is no such id in todos");
  }
});

app.post("/blogs", async (req, res) => {
  try {
    const { title, description, imageUrl, categoryId } = req.body;

    const posts = await prisma.post.create({
      data: {
        title: title,
        description: description,
        imageUrl: imageUrl,
        categoryId: categoryId as number,
      },
    });
    res.json(posts);
  } catch (e) {
    if (e instanceof Error) res.status(404).send(e.message);
  }
});

app.put("/blogs", async (req, res) => {
  try {
    const { id, title, description, imageUrl, categoryId } = req.body;
    const updatedBlogs = await prisma.post.update({
      where: {
        id: Number(id),
      },
      data: {
        title: title,
        description: description,
        imageUrl: imageUrl,
        categoryId: categoryId as number,
      },
    });
    res.json(updatedBlogs);
  } catch (e) {
    res.status(404).send("Todos Not Updated");
  }
});
app.delete("/blogs/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deletedBlogs = await prisma.post.delete({
      where: {
        id: Number(id),
      },
    });
    res.json(deletedBlogs);
  } catch (e) {
    res.status(404).send("Nothing here tto delete");
  }
});

app.listen(Port, () => {
  console.log(`Server up on port ${Port}`);
});
