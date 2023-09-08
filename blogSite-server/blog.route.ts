import express from "express";
import { blogController } from ".";
import { verifyUser } from "../resources/users/user.controller";

const blogRoute = express.Router();

blogRoute.get("/blogs", async (req, res) => {
  await blogController.getAll(req, res);
});
// blogRoute.get("/blogs/:id", async (req, res) => {
//   await blogController.getBlogById(req, res);
// });
blogRoute.get("/blogs/:slug", async (req, res) => {
  await blogController.getBlogBySlug(req, res);
});
blogRoute.post("/blogs", verifyUser, async (req, res) => {
  await blogController.createBlog(req, res);
});
export { blogRoute };
