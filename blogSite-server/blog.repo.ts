import { PrismaClient, Prisma } from "@prisma/client";

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

const getAllWithSearch = async (
  offset: number,
  pageSize: number,
  searchVal: string
) => {
  return await prisma.post.findMany({
    skip: offset,
    take: pageSize,
    where: {
      title: {
        contains: searchVal,
      },
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
      isDraft: false,
      thumbImageUrl: true,
      id: true,
      createdAt: true,
      slug: true,
    },
  });
};

const getBlogBySlug = async (slug: string) => {
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
      isDraft: false,
      thumbImageUrl: true,
      id: true,
      createdAt: true,
      slug: true,
    },
  });
};

const createBlog = async (blogData: Prisma.PostCreateArgs["data"]) => {
  return await prisma.post.create({
    data: blogData,
  });
};

const blogDraft = async (blogData: Prisma.PostCreateArgs["data"]) => {
  return await prisma.post.create({
    data: blogData,
  });
};
export const blogRepo = {
  getAll,
  getAllWithSearch,
  getBlogById,
  createBlog,
  getBlogBySlug,
  blogDraft,
};
