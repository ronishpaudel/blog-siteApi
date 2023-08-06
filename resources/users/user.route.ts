import express, { NextFunction } from "express";
import { userController, userRepo } from ".";
import jwt from "jsonwebtoken";

import { Prisma, PrismaClient } from "@prisma/client";
import { checkJwt } from "./user.controller";

const userRoute = express.Router();
const prisma = new PrismaClient();

// Query ROUTES
userRoute.get("/users", checkJwt, async (req, res) => {
  await userController.getAll(req, res);
});

//mutation route
userRoute.post("/user/signup", async (req, res) => {
  await userController.createUser(req, res);
});

//verification through jwt
userRoute.post("/user/email-confirm", async (req, res) => {
  await userController.verification(req, res);
});

//login
userRoute.post("/user/signin", async (req, res) => {
  await userController.signin(req, res);
});

export { userRoute };
