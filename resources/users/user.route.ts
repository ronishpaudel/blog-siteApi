import express from "express";
import { userController } from ".";

import { checkJwt } from "./user.controller";

const userRoute = express.Router();

// Query ROUTES
userRoute.get("/user", checkJwt, async (req, res) => {
  await userController.getAll(req, res);
});

userRoute.get("/user/category", async (req, res) => {
  await userController.getAllCategory(req, res);
});

userRoute.get("/user/me", checkJwt, async (req, res) => {
  try {
    const { id, username, email } = req.authUser;

    return res.status(200).json({ id, username, email });
  } catch (error) {
    return res.status(500).json({ message: " server error." });
  }
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

userRoute.post("/user/reset-password", async (req, res) => {
  await userController.resetPassword(req, res);
});

userRoute.post("/user/update-password", async (req, res) => {
  await userController.updatePassword(req, res);
});
export { userRoute };
