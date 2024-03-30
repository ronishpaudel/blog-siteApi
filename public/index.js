"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRoute = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const users_1 = require("./resources/users");
const user_controller_1 = require("./resources/users/user.controller");
const s3Upload_1 = require("./utils/s3Upload");
const blog_route_1 = require("./blogSite-server/blog.route");
Object.defineProperty(exports, "blogRoute", { enumerable: true, get: function () { return blog_route_1.blogRoute; } });
const google_auth_library_1 = require("google-auth-library");
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const Port = 3007;
app.use(users_1.userRoute);
app.use(blog_route_1.blogRoute);
app.get("/", (req, res) => {
    return res.send("Hello,world");
});
app.get("/myblogs", async (req, res) => {
    try {
        const token = req.headers["authorization"];
        console.log({ myblogsToken: token });
        const { verify } = jsonwebtoken_1.default;
        if (!token) {
            return res.status(401).json({ message: "No token provided." });
        }
        const decoded = verify(String(token), process.env.JWT_SECRET_KEY);
        const myblogs = await prisma.post.findMany({
            where: {
                userId: decoded === null || decoded === void 0 ? void 0 : decoded.id,
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
                        username: true,
                    },
                },
                title: true,
                description: true,
                imageUrl: true,
                thumbImageUrl: true,
                id: true,
                createdAt: true,
                slug: true,
            },
        });
        return res.json(myblogs);
    }
    catch (e) {
        return res.status(404).send("blogs Not found");
    }
});
app.put("/blogs", user_controller_1.verifyUser, async (req, res) => {
    try {
        const { id, title, description, imageUrl, categoryId, thumbImageUrl } = req.body;
        const authUser = req.authUser;
        const updatedBlogs = await prisma.post.update({
            where: {
                id: Number(id),
            },
            data: {
                title: title,
                description: description,
                imageUrl: imageUrl,
                categoryId: categoryId,
                userId: authUser.id,
                thumbImageUrl,
            },
        });
        return res.json(updatedBlogs);
    }
    catch (e) {
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
    }
    catch (e) {
        return res.status(404).send("Nothing here tto delete");
    }
});
//image-upload url
app.post("/s3_upload_url", async (_, res) => {
    try {
        const thumbnailUpload = await (0, s3Upload_1.s3Upload)();
        const normalUpload = await (0, s3Upload_1.s3Upload)();
        return res.send({
            message: "Successfully created upload URL",
            data: { thumbnailUpload, normalUpload },
        });
    }
    catch (error) {
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
    }
    catch (e) {
        res.status(404).send("category not updated");
    }
});
app.listen(Port, () => {
    console.log(`Server up on port ${Port}`);
});
// email verification template sample not being used for reading purpose
var EmailVerificationTemplate = {
    Template: {
        TemplateName: "EmailVerification",
        SubjectPart: "Verify your email at techEra blogs",
        HtmlPart: "<h1>Hello,</h1><h3>Please use the following link to verify your email address.</h3> {{link}}",
        TextPart: "Hello,\r\nPlease use the following link to verify your email address. {{link}}.",
    },
};
const CLIENT_ID = process.env.CLIENT_ID;
const oAuthClient = new google_auth_library_1.OAuth2Client(CLIENT_ID);
app.post("/user/registration", async (req, res) => {
    const { googleAuthToken, username } = req.body;
    if (!CLIENT_ID)
        return;
    console.log("Received googleToken:", googleAuthToken);
    let newUser = null;
    let hasUsername = false;
    try {
        console.log("on try");
        const ticket = await oAuthClient.verifyIdToken({
            idToken: String(googleAuthToken),
            audience: [CLIENT_ID],
        });
        const payload = ticket.getPayload();
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
        }
        else {
            if (newUser.username) {
                hasUsername = true;
            }
            else {
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
        res.json(Object.assign(Object.assign({}, newUser), { hasUsername: hasUsername }));
    }
    catch (e) {
        console.error("User creation failed:", e);
        res.status(401).send("User creation failed");
    }
});
