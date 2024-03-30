"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogController = void 0;
const randomNumber_1 = require("../utils/randomNumber");
const blog_repo_1 = require("./blog.repo");
//get-query for blogs
const getAll = async (req, res) => {
    console.log(req.query);
    const currentPage = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 9;
    const offset = pageSize * (currentPage - 1);
    const searchVal = req.query.q;
    try {
        if (!searchVal) {
            const blogs = await blog_repo_1.blogRepo.getAll(offset, pageSize);
            return res.json(blogs);
        }
        else {
            const blogs = await blog_repo_1.blogRepo.getAllWithSearch(offset, pageSize, String(searchVal));
            return res.json(blogs);
        }
    }
    catch (e) {
        console.log(e);
        return res.status(400).json({ e });
    }
};
const getBlogById = async (req, res) => {
    const { id } = req.params;
    const blogs = await blog_repo_1.blogRepo.getBlogById(Number(id));
    return res.json(blogs);
};
const getBlogBySlug = async (req, res) => {
    const { slug } = req.params;
    const blogs = await blog_repo_1.blogRepo.getBlogBySlug(slug);
    return res.json(blogs);
};
// post-mutation for blogs
const createBlog = async (req, res) => {
    try {
        const { title, description, imageUrl, categoryId, thumbImageUrl } = req.body;
        const authUser = req.authUser;
        const slug = title.toLowerCase().replaceAll(" ", "-") + "-" + String((0, randomNumber_1.randomNumber)());
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
        const blog = await blog_repo_1.blogRepo.createBlog(blogData);
        return res.json(blog);
    }
    catch (e) {
        if (e instanceof Error)
            res.status(404).send(e.message);
    }
};
//save as draft
const draftBlog = async (req, res) => {
    try {
        const { title, description, imageUrl, categoryId, thumbImageUrl } = req.body;
        const authUser = req.authUser;
        const slug = title.toLowerCase().replaceAll(" ", "-") + "-" + String((0, randomNumber_1.randomNumber)());
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
        const blog = await blog_repo_1.blogRepo.blogDraft(blogData);
        return res.json(blog);
    }
    catch (e) {
        if (e instanceof Error)
            res.status(404).send(e.message);
    }
};
exports.blogController = {
    getAll,
    getBlogById,
    createBlog,
    getBlogBySlug,
    draftBlog,
};
