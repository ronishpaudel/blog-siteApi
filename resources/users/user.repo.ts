import { Prisma, PrismaClient, User } from "@prisma/client";
import { IUserData } from "../../types/Types";

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
//post | mutation
export const createUser = async (userData: IUserData) => {
  return await prisma.user.create({
    data: userData,
  });
};

export const userRepo = {
  createUser,
  getAll,
  getAllWithSearch,
  getOneUser,
  verifyUser,
};
