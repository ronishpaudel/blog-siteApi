import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//get | query
export const getAll = async (offset: number, pageSize: number) => {
  console.log("repo bhitra chiryo");
  return await prisma.user.findMany({
    skip: offset,
    take: pageSize,
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getAllWithSearch = async (
  offset: number,
  pageSize: number,
  searchVal: string
) => {
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

//post | mutation
export const createUser = async (userData: any) => {
  return await prisma.user.create({
    data: userData,
  });
};
export const userRepo = {
  createUser,
  getAll,
  getAllWithSearch,
};
