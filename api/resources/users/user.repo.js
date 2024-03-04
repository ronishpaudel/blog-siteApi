"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepo = exports.createUser = exports.getAllWithSearchCategory = exports.getAllCategory = exports.verifyUser = exports.getAllWithSearch = exports.getAll = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
//get | query
const getAll = async (offset, pageSize) => {
    console.log("repo bhitra chiryo");
    return await prisma.user.findMany({
        skip: offset,
        take: pageSize,
        select: {
            isVerified: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
exports.getAll = getAll;
const getAllWithSearch = async (offset, pageSize, searchVal) => {
    console.log("getAllwithSearch ko repo ma aayo");
    return await prisma.user.findMany({
        skip: offset,
        take: pageSize,
        where: {
            fname: {
                contains: searchVal,
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
exports.getAllWithSearch = getAllWithSearch;
const getOneUser = async (payload) => {
    return await prisma.user.findUnique({
        where: payload,
    });
};
const verifyUser = async (payload) => {
    return await prisma.user.update({
        where: { email: payload.email },
        data: {
            isVerified: true,
        },
    });
};
exports.verifyUser = verifyUser;
//get of category by all and by seacrhval
const getAllCategory = async (offset, pageSize) => {
    console.log("ayyo");
    return await prisma.category.findMany({
        skip: offset,
        take: pageSize,
        orderBy: {
            createdAt: "desc",
        },
    });
};
exports.getAllCategory = getAllCategory;
const getAllWithSearchCategory = async (offset, pageSize, searchVal) => {
    console.log("SEarchval vitra aayo");
    return await prisma.category.findMany({
        skip: offset,
        take: pageSize,
        where: {
            name: {
                contains: searchVal,
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
exports.getAllWithSearchCategory = getAllWithSearchCategory;
//post | mutation
const createUser = async (userData) => {
    return await prisma.user.create({
        data: userData,
    });
};
exports.createUser = createUser;
const updatePassword = async (email, password) => {
    return await prisma.user.update({
        where: { email },
        data: {
            password,
        },
    });
};
exports.userRepo = {
    createUser: exports.createUser,
    getAll: exports.getAll,
    getAllWithSearch: exports.getAllWithSearch,
    getOneUser,
    verifyUser: exports.verifyUser,
    getAllCategory: exports.getAllCategory,
    getAllWithSearchCategory: exports.getAllWithSearchCategory,
    updatePassword,
};
