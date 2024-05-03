import { randomNumber } from "../utils/randomNumber";
import { blogRepo } from "./blog.repo";
import { Request, Response } from "express";

//get-query for blogs
const getAll = async (req: Request, res: Response) => {
  //console.log(req.query);
  const currentPage = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 9;
  const offset = pageSize * (currentPage - 1);
  const searchVal = req.query.q;
  try {
    if (!searchVal) {
      const blogs = await blogRepo.getAll(offset, pageSize);

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

const getBlogBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;
  const blogs = await blogRepo.getBlogBySlug(slug);
  return res.json(blogs);
};

// post-mutation for blogs
const createBlog = async (req: Request, res: Response) => {
  try {
    const { title, description, imageUrl, categoryId, thumbImageUrl } =
      req.body;
    const authUser = req.authUser;
    const slug =
      title.toLowerCase().replaceAll(" ", "-") + "-" + String(randomNumber());
    const blogData = {
      title,
      description,
      imageUrl,
      categoryId,
      thumbImageUrl,
      userId: authUser.id,
      slug,
    };

    console.log({ blogData });

    const blog = await blogRepo.createBlog(blogData);
    return res.json(blog);
  } catch (e) {
    if (e instanceof Error) res.status(404).send(e.message);
  }
};

//save as draft
const draftBlog = async (req: Request, res: Response) => {
  try {
    const { title, description, imageUrl, categoryId, thumbImageUrl } =
      req.body;
    const authUser = req.authUser;
    const slug =
      title.toLowerCase().replaceAll(" ", "-") + "-" + String(randomNumber());
    const blogData = {
      title,
      description,
      imageUrl,
      categoryId,
      thumbImageUrl,
      userId: authUser.id,
      isDraft: true,
      slug,
    };

    console.log({ blogData });

    const blog = await blogRepo.blogDraft(blogData);
    return res.json(blog);
  } catch (e) {
    if (e instanceof Error) res.status(404).send(e.message);
  }
};
export const blogController = {
  getAll,
  getBlogById,
  createBlog,
  getBlogBySlug,
  draftBlog,
};
