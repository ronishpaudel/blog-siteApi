import { PrismaClient } from "@prisma/client";
import { IBlog } from "../types/types";

const prisma = new PrismaClient();

//getQuery of blogs
export const getAll = async (offset: number, pageSize: number) => {
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
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getAllWithSearch = async (
  offset: number,
  pageSize: number,
  searchVal: string
) => {
  console.log("getAllwithSearch ko repo ma aayo");
  return await prisma.user.findMany({
    skip: offset,
    take: pageSize,
    where: {
      username: {
        contains: searchVal,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getBlogById = async (id: number) => {
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
    },
  });
};

const createBlog = async (blogData: IBlog) => {
  return await prisma.post.create({
    data: blogData,
  });
};

export const blogRepo = {
  getAll,
  getAllWithSearch,
  getBlogById,
  createBlog,
};
