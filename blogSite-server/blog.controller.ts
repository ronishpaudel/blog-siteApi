import { blogRepo } from "./blog.repo";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

//get-query for blogs
const getAll = async (req: Request, res: Response) => {
  const currentPage = Number(req.query.page) || 1;
  const pageSize = Number(req.query.page_size) || 10;
  const offset = pageSize * (currentPage - 1);
  const searchVal = req.query.q;
  try {
    if (!searchVal) {
      const blogs = await blogRepo.getAll(offset, pageSize);
      console.log("search val chaina", { blogs: blogs });
      return res.json(blogs);
    } else {
      const blogs = await blogRepo.getAllWithSearch(
        offset,
        pageSize,
        String(searchVal)
      );
      return res.json(blogs);
    }
  } catch (e) {
    console.log(e);
    return res.status(400).json({ e });
  }
};

const getBlogById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const blogs = await blogRepo.getBlogById(Number(id));
  return res.json(blogs);
};

//post-mutation for blogs
const createBlog = async (req: Request, res: Response) => {
  const { title, description, imageUrl, categoryId, thumbImageUrl } = req.body;
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send("Unauthorized");
  }
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const id = decodedToken.id;
  const blogData = {
    title,
    description,
    imageUrl,
    categoryId,
    thumbImageUrl,
    userId: id,
  };
  const blog = await blogRepo.createBlog(blogData);
  return res.json(blog);
};

export const blogController = {
  getAll,
  getBlogById,
  createBlog,
};
