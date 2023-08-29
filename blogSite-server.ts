import express from "express";
import { PrismaClient } from "@prisma/client";
import { userRoute } from "./resources/users";
import { checkJwt, checkUser } from "./resources/users/user.controller";
import { s3Upload } from "./utils/s3Upload";
import { blogRoute } from "./blogSite-server/blog.route";

const prisma = new PrismaClient();

const app = express();
var cors = require("cors");
var jwt = require("jsonwebtoken");

app.use(cors());
app.use(express.json());
const Port = 3005;

app.use(userRoute);
app.use(blogRoute);

app.get("/", (req, res) => {
  return res.send("Hello,world");
});

app.put("/blogs", checkJwt, async (req, res) => {
  try {
    const { id, title, description, imageUrl, categoryId, thumbImageUrl } =
      req.body;
    const authUser = req.authUser;

    const updatedBlogs = await prisma.post.update({
      where: {
        id: Number(id),
      },
      data: {
        title: title,
        description: description,
        imageUrl: imageUrl,
        categoryId: categoryId as number,
        userId: authUser.id,
        thumbImageUrl,
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
  try {
    const thumbnailUpload = await s3Upload();
    const normalUpload = await s3Upload();
    return res.send({
      message: "Successfully created upload URL",
      data: { thumbnailUpload, normalUpload },
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
export { blogRoute };

// email verification template sample not being used just for reading purpose
var EmailVerificationTemplate = {
  Template: {
    TemplateName: "EmailVerification",
    SubjectPart: "Verify your email at techEra blogs",
    HtmlPart:
      "<h1>Hello,</h1><h3>Please use the following link to verify your email address.</h3> {{link}}",
    TextPart:
      "Hello,\r\nPlease use the following link to verify your email address. {{link}}.",
  },
};
