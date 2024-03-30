"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRoute = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../resources/users/user.controller");
const blog_controller_1 = require("./blog.controller");
const blogRoute = express_1.default.Router();
exports.blogRoute = blogRoute;
blogRoute.get("/blogs", async (req, res) => {
    await blog_controller_1.blogController.getAll(req, res);
});
// blogRoute.get("/blogs/:id", async (req, res) => {
//   await blogController.getBlogById(req, res);
// });
blogRoute.get("/blogs/:slug", async (req, res) => {
    await blog_controller_1.blogController.getBlogBySlug(req, res);
});
blogRoute.post("/blogs", user_controller_1.verifyUser, async (req, res) => {
    await blog_controller_1.blogController.createBlog(req, res);
});
blogRoute.post("/draft-blogs", user_controller_1.verifyUser, async (req, res) => {
    await blog_controller_1.blogController.draftBlog(req, res);
});
