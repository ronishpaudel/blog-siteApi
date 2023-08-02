import express from "express";
import { userController, userRepo } from ".";
import jwt from "jsonwebtoken";

import { Prisma, PrismaClient } from "@prisma/client";

const userRoute = express.Router();
const prisma = new PrismaClient();

// Query ROUTES
userRoute.get("/users", async (req, res) => {
  await userController.getAll(req, res);
});

//mutation route
userRoute.post("/user/signup", async (req, res) => {
  await userController.createUser(req, res);
});

//verification through jwt
userRoute.post("/user/email-confirm", async (req, res) => {
  const { token } = req.headers;
  console.log({ headers: req.headers });
  console.log({ token: token });
  if (!token || typeof token !== "string") {
    return res.status(400).json({ error: "Invalid or expired token." });
  }
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY!);
    const user = await userRepo.getOneUser({ email: decoded.email });
    if (user) {
      await userRepo.verifyUser({ email: decoded?.email });
    } else {
      res.status(404).json({ error: "user not found." });
    }
    console.log({ decoded });
    res.send();
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: "Invalid or expired token." });
  }
});
export { userRoute };
