import { Prisma, PrismaClient, User } from "@prisma/client";
import { IUserData, Icategory } from "../../types/types";

const prisma = new PrismaClient();

//get | query
export const getAll = async (offset: number, pageSize: number) => {
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
const getOneUser = async (payload: Prisma.UserWhereUniqueInput) => {
  return await prisma.user.findUnique({
    where: payload,
  });
};

export const verifyUser = async (payload: Prisma.UserWhereUniqueInput) => {
  return await prisma.user.update({
    where: { email: payload.email },
    data: {
      isVerified: true,
    },
  });
};
//get of category by all and by seacrhval
export const getAllCategory = async (offset: number, pageSize: number) => {
  console.log("ayyo");
  return await prisma.category.findMany({
    skip: offset,
    take: pageSize,
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getAllWithSearchCategory = async (
  offset: number,
  pageSize: number,
  searchVal: string
) => {
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

//post | mutation
export const createUser = async (userData: IUserData) => {
  return await prisma.user.create({
    data: userData,
  });
};

const updatePassword = async (email: string, password: string) => {
  return await prisma.user.update({
    where: { email },
    data: {
      password,
    },
  });
};

export const userRepo = {
  createUser,
  getAll,
  getAllWithSearch,
  getOneUser,
  verifyUser,
  getAllCategory,
  getAllWithSearchCategory,
  updatePassword,
};
