import express from "express";
import { PrismaClient } from "@prisma/client";
import { userRoute } from "./resources/users";
import { verifyUser } from "./resources/users/user.controller";
import { s3Upload } from "./utils/s3Upload";
import { blogRoute } from "./blogSite-server/blog.route";
import { OAuth2Client, TokenPayload } from "google-auth-library";

const prisma = new PrismaClient();

const app = express();
var cors = require("cors");
var jwt = require("jsonwebtoken");

app.use(cors());
app.use(express.json());
const Port = 3007;

app.use(userRoute);
app.use(blogRoute);

app.get("/", (req, res) => {
  return res.send("Hello,world");
});

app.put("/blogs", verifyUser, async (req, res) => {
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
const CLIENT_ID = process.env.CLIENT_ID;
const oAuthClient = new OAuth2Client(CLIENT_ID);

app.post("/user/registration", async (req, res) => {
  const { googleAuthToken, username } = req.body;
  if (!CLIENT_ID) return;
  console.log("Received googleToken:", googleAuthToken);
  let newUser = null;
  let hasUsername = false;
  try {
    console.log("on try");
    const ticket = await oAuthClient.verifyIdToken({
      idToken: String(googleAuthToken),
      audience: [CLIENT_ID],
    });

    const payload: TokenPayload | undefined = ticket.getPayload();
    if (!payload) {
      throw new Error("Invalid token payload");
    }
    console.log("payload", payload);
    const name = payload.given_name || payload.family_name || "";
    const email = payload.email;

    // Check if email is defined
    if (!email) {
      throw new Error("Email is undefined");
    }

    let newUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!newUser) {
      newUser = await prisma.user.create({
        data: {
          email: email,
          username: name,
          googleAuthToken: googleAuthToken,
        },
      });
    } else {
      if (newUser.username) {
        hasUsername = true;
      } else {
        newUser = await prisma.user.update({
          where: {
            email: email,
          },
          data: {
            username: username,
          },
        });
      }
    }
    res.json({ ...newUser, hasUsername: hasUsername });
  } catch (e) {
    console.error("User creation failed:", e);
    res.status(401).send("User creation failed");
  }
});
