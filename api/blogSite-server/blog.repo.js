"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRepo = exports.getAll = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
//getQuery of blogs
const getAll = async (offset, pageSize) => {
    return await prisma.post.findMany({
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
        where: {
            isDraft: false,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
exports.getAll = getAll;
const getAllWithSearch = async (offset, pageSize, searchVal) => {
    return await prisma.post.findMany({
        skip: offset,
        take: pageSize,
        where: {
            title: {
                contains: searchVal,
            },
            isDraft: false,
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
        orderBy: {
            createdAt: "desc",
        },
    });
};
const getBlogById = async (id) => {
    return await prisma.post.findUnique({
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
};
const getBlogBySlug = async (slug) => {
    return await prisma.post.findUnique({
        where: {
            slug,
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
};
const createBlog = async (blogData) => {
    return await prisma.post.create({
        data: blogData,
    });
};
const blogDraft = async (blogData) => {
    return await prisma.post.create({
        data: blogData,
    });
};
exports.blogRepo = {
    getAll: exports.getAll,
    getAllWithSearch,
    getBlogById,
    createBlog,
    getBlogBySlug,
    blogDraft,
};
