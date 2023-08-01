import express from "express";
import { userController } from ".";

const userRoute = express.Router();

// Query ROUTES
userRoute.get("/users", async (req, res) => {
  await userController.getAll(req, res);
});

//mutation route
userRoute.post("/user/signup", async (req, res) => {
  await userController.createUser(req, res);
});

export { userRoute };
