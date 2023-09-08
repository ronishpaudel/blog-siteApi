import { NextFunction, Request, Response } from "express";
import { userRepo } from "./user.repo";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { SendTemplatedEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "../../utils/ses";

//get | query
const getAll = async (req: Request, res: Response) => {
  const currentPage = Number(req.query.page) || 1;
  const pageSize = Number(req.query.page_size) || 10;
  const offset = pageSize * (currentPage - 1);
  const searchVal = req.query.q;
  console.log("controller bhitra chiryo", { searchVal });
  try {
    if (!searchVal) {
      const users = await userRepo.getAll(offset, pageSize);
      // console.log("search val chaina", { users });
      return res.json(users);
    } else {
      const users = await userRepo.getAllWithSearch(
        offset,
        pageSize,
        String(searchVal)
      );
      return res.json(users);
    }
  } catch (e) {
    console.log(e);
    return res.status(400).json({ e });
  }
};

//get of category

const getAllCategory = async (req: Request, res: Response) => {
  const currentPage = Number(req.query.page) || 1;
  const pageSize = Number(req.query.page_size) || 10;
  const offset = pageSize * (currentPage - 1);
  const searchVal = req.query.q;
  console.log("controller bhitra category chiryo", { searchVal });
  try {
    if (!searchVal) {
      const categories = await userRepo.getAllCategory(offset, pageSize);
      // console.log("search val chaina", { categories });
      res.json(categories);
    } else {
      const category = await userRepo.getAllWithSearchCategory(
        offset,
        pageSize,
        String(searchVal)
      );
      return res.json(category);
    }
  } catch (e) {
    res.status(404).json({ e });
  }
};

//post | mutation for user
//signup
const createUser = async (req: Request, res: Response) => {
  const { id, email, fname, lname, password, phoneNumber, username } = req.body;

  try {
    const existingUser = await userRepo.getOneUser({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
      // throw "user already exists";
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = await bcrypt.hash(password, salt);
    const userData = {
      email: email,
      username,
      fname: fname,
      password: hash,
      lname: lname,
      phoneNumber: String(phoneNumber),
    };
    const user = await userRepo.createUser(userData);
    console.log({ user });

    const { sign } = jwt;
    const token = sign(
      {
        email: email,
        id: user.id,
        // exp: 10 * 60 * 1000,
      },
      process.env.JWT_SECRET_KEY!
    );
    console.log({ accessToken: token });
    const link = `${process.env.BLOG_PAGE}?token=${token}`;
    console.log({ link });

    //send verify email
    // const params = {
    //   Destination: {
    //     ToAddresses: [email],
    //   },
    //   Source: "swikarsharma@gmail.com",
    //   Template: "EmailVerification",
    //   TemplateData: `{ "link": "${link}" }`,
    //   ReplyToAddresses: [],
    // };
    // sesClient.send(new SendTemplatedEmailCommand(params));

    return res.status(200).json({ user, token });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ error: "Failed to create user." });
  }
};

//signup verification
const verification = async (req: Request, res: Response) => {
  const { token } = req.headers;

  console.log({ headers: req.headers });
  console.log({ token: token });
  if (!token || typeof token !== "string") {
    return res.status(400).json({ error: "Invalid or expired token." });
  }
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY!);
    const user = await userRepo.getOneUser({
      email: decoded.email,
    });
    if (user) {
      await userRepo.verifyUser({
        email: decoded?.email,
      });
    } else {
      return res.status(404).json({ error: "user not found." });
    }
    console.log({ decoded });
    return res.status(200).json({ user, token });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ error: "Invalid or expired token." });
  }
};

//signin
const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const existingUser = await userRepo.getOneUser({ email });

    if (!existingUser) {
      return res
        .status(400)
        .json({ errorType: "USER_NOT_FOUND", message: "User not found." });
    }

    if (!existingUser.isVerified) {
      const { sign } = jwt;
      const token = sign(
        {
          email: email,
          id: existingUser.id,
        },
        process.env.JWT_SECRET_KEY!
      );
      console.log({ accessToken: token });
      const link = `${process.env.BLOG_PAGE}?token=${token}`;
      console.log({ link });
      return res.status(400).json({
        errorType: "USER_NOT_VERIFIED",
        message: "user not verified",
        token,
      });
    }

    const matchPassword = bcrypt.compareSync(
      password,
      String(existingUser?.password)
    );
    if (!matchPassword) {
      return res.status(400).json({
        errorType: "INVALID_CREDENTIALS",
        message: "Invalid credentials.",
      });
    }
    const { sign } = jwt;
    const token = sign(
      { email: existingUser?.email, id: existingUser?.id },
      process.env.JWT_SECRET_KEY!
    );
    return res.status(200).json({ user: existingUser, token });
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ errorType: "USER_NOT_FOUND", message: "User not found." });
  }
};

//middleware

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }
  try {
    console.log("token in middleware:", token);
    const { verify } = jwt;
    const decoded: any = verify(token, process.env.JWT_SECRET_KEY!);

    console.log({ decoded });
    const user = await userRepo.getOneUser({ id: decoded.id });
    req.authUser = user as User;
    if (user) {
      next();
      // return res.status(201).json({ message: "nice intiative" });
    } else {
      return res.status(401).json({ message: "token invalid." });
    }
  } catch (e) {
    return res.status(401).json({ message: "token invalid." });
    // console.log(e);
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const existingUser = await userRepo.getOneUser({ email: email });
    if (existingUser) {
      const { sign } = jwt;
      const accessToken = sign(
        {
          email: email,
        },
        process.env.JWT_SECRET_KEY!
      );
      const link = `${process.env.AUTH_PAGE}?token=${accessToken}`;
      console.log(link);
    } else {
      return res.status(404).json({ message: " existing user not found." });
    }
    return res.status(200).json({ message: "resetting password" });
  } catch (e) {
    return res.status(401).json({ message: "email not exist." });
  }
};

//reset and updatig password
const updatePassword = async (req: Request, res: Response) => {
  console.log("hello");
  // const { token } = req.query;
  const { password, token } = req.body;
  console.log({ password }, { token });

  if (!token || typeof token !== "string") {
    return res.status(400).json({ error: "Invalid or expired token." });
  }
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY!);
    const email = decoded.email;
    const user = await userRepo.getOneUser({ email: email });
    if (user) {
      const salt = bcrypt.genSaltSync(10);
      const hash = await bcrypt.hash(password, salt);
      await userRepo.updatePassword(email, hash);
    } else {
      return res.status(404).json({ error: "user not found." });
    }
    console.log({ decoded });
    return res
      .status(200)
      .json({ messgae: "sucessfully updated the password", user });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ error: "Invalid or expired token." });
  }
};
export const userController = {
  createUser,
  getAll,
  verification,
  signin,
  resetPassword,
  updatePassword,
  getAllCategory,
  verifyUser,
};
