import express from "express";
import { blogController } from ".";

const blogRoute = express.Router();

blogRoute.get("/blogs", async (req, res) => {
  await blogController.getAll(req, res);
});
blogRoute.get("/blogs/:id", async (req, res) => {
  await blogController.getBlogById(req, res);
});
// blogRoute.post("/blogs", async (req, res) => {
//   await blogController.createBlog(req, res);
// });
export { blogRoute };
