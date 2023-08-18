import express from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { userRoute } from "./resources/users";
import { checkJwt, checkUser } from "./resources/users/user.controller";
import { v4 as uuid } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const prisma = new PrismaClient();

const app = express();
var cors = require("cors");
var jwt = require("jsonwebtoken");

app.use(cors());
app.use(express.json());
const Port = 3001;

app.use(userRoute);

app.get("/verify/:token", (req, res) => {
  const { token } = req.params;

  // Verifying the JWT token
  jwt.verify(token, "ourSecretKey", function (err: Error) {
    if (err) {
      console.log(err);
      return res.send(`Email verification failed, 
                  possibly the link is invalid or expired`);
    } else {
      return res.send("Email verifified successfully");
    }
  });
});

app.get("/", (req, res) => {
  return res.send("Hello,world");
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
          user: {
            select: {
              id: true,
              fname: true,
              lname: true,
            },
          },
          title: true,
          description: true,
          imageUrl: true,
          id: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return res.json(posts);
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
      return res.json(posts);
    }
  } catch (e) {
    return res.status(404).send("Not Found");
  }
});

app.get("/blogs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const posts = await prisma.post.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            fname: true,
            lname: true,
          },
        },
        title: true,
        description: true,
        imageUrl: true,
        createdAt: true,
      },
    });
    return res.json(posts);
  } catch (e) {
    return res.status(404).send("there is no such id in todos");
  }
});

app.post("/blogs", async (req, res) => {
  try {
    const { title, description, imageUrl, categoryId } = req.body;
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).send("Unauthorized");
    }

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const id = decodedToken.id;

    const todo = await prisma.post.create({
      data: {
        title: title,
        description: description,
        imageUrl: imageUrl,
        categoryId: categoryId,
        userId: id,
      },
    });
    res.json(todo);
  } catch (e) {
    if (e instanceof Error) res.status(404).send(e.message);
  }
});
app.put("/blogs", checkUser, async (req, res) => {
  try {
    const { id, title, description, imageUrl, categoryId } = req.body;
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).send("Unauthorized");
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decodedToken.id;
    const updatedBlogs = await prisma.post.update({
      where: {
        id: Number(id),
      },
      data: {
        title: title,
        description: description,
        imageUrl: imageUrl,
        categoryId: categoryId as number,
        userId: userId,
      },
    });
    return res.json(updatedBlogs);
  } catch (e) {
    return res.status(404).send("blogs Not Updated");
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
    return res.json(deletedBlogs);
  } catch (e) {
    return res.status(404).send("Nothing here tto delete");
  }
});

//image-upload url
app.post("/s3_upload_url", async (_, res) => {
  const BUCKET_NAME = "testing-todo";
  const BUCKET_URL = "https://testing-todo.s3.ap-south-1.amazonaws.com";
  const FOLDER_NAME = "blog_images";
  try {
    const id = uuid();
    const command = new PutObjectCommand({
      ACL: "public-read",
      Bucket: BUCKET_NAME,
      Key: `/${FOLDER_NAME}/${id}.jpg`,
    });
    // console.log(process.env.ACCESS_KEY);
    const imageClient = new S3Client({
      region: "ap-south-1",
      credentials: {
        accessKeyId: process.env.ACCESS_KEY!!,
        secretAccessKey: process.env.SECRET_ACCESS_KEY!!,
      },
    });
    const uploadUrl = await getSignedUrl(imageClient, command, {
      expiresIn: 60 * 30,
    });

    const url = `${BUCKET_URL}//${FOLDER_NAME}/${id}.jpg`;

    return res.send({
      message: "Successfully created upload URL",
      data: {
        uploadUrl,
        url,
      },
    });
  } catch (error) {
    return res.status(400).send({
      message: "Failed to create upload URL",
      error,
    });
  }
});

app.post("/user/category", async (req, res) => {
  try {
    const { name } = req.body;
    const categories = await prisma.category.create({
      data: {
        name: name,
      },
    });
    res.json(categories);
  } catch (e) {
    res.status(404).send("category not updated");
  }
});

app.listen(Port, () => {
  console.log(`Server up on port ${Port}`);
});
