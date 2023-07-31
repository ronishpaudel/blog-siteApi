import { PrismaClient } from "@prisma/client";
import { NextFunction } from "express";
const prisma = new PrismaClient();

//get | query
export const getAll = async (offset: number, pageSize: number) => {
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
