import { NextFunction, Request, Response } from "express";
import { userRepo } from "./user.repo";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";

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
      console.log("search val chaina", { users });
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
      console.log("search val chaina", { categories });
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
const createUser = async (req: Request, res: Response) => {
  const { id, email, fname, lname, password, companyName, phoneNumber } =
    req.body;

  try {
    const existingUser = await userRepo.getOneUser({ email: email });
    if (existingUser) {
      // return res.status(400).json({ message: "User already exists" });
      throw "user already exists";
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = await bcrypt.hash(password, salt);
    const userData = {
      email: email,
      fname: fname,
      password: hash,
      lname: lname,
      companyName: companyName,
      phoneNumber: phoneNumber,
    };
    const user = await userRepo.createUser(userData);
    console.log({ user });

    const { sign } = jwt;
    const accessToken = sign(
      {
        email: email,
        id: id,
        iat: Math.floor(Date.now() / 1000) - 30,
      },
      process.env.JWT_SECRET_KEY!
    );
    console.log({ accessToken });
    const link = `${process.env.BLOG_PAGE}?token=${accessToken}`;
    console.log({ link });

    return res.json(user);
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
    const user = await userRepo.getOneUser({ email: decoded.email });
    if (user) {
      await userRepo.verifyUser({
        email: decoded?.email,
      });
    } else {
      return res.status(404).json({ error: "user not found." });
    }
    console.log({ decoded });
    return res.status(200).json({ messgae: "sucessfully verified" });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ error: "Invalid or expired token." });
  }
};

//signin
const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const jwtToken = req.headers["authorization"];
  console.log("JWT Token:", jwtToken);
  try {
    const existingUser = await userRepo.getOneUser({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const matchPassword = bcrypt.compareSync(
      password,
      String(existingUser?.password)
    );
    if (!matchPassword) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const { sign } = jwt;
    const token = sign(
      { email: existingUser?.email, id: existingUser?.id },
      process.env.JWT_SECRET_KEY!
    );
    return res.status(201).json({ user: existingUser, token });
    console.log({ existingUser });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ error: "Failed to Signin." });
  }
};

//middleware

export const checkJwt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }
  console.log("token in middleware:", token);
  try {
    const { verify } = jwt;
    const decoded: any = verify(token as string, process.env.JWT_SECRET_KEY!);
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

//middleware for editing blog
export const checkUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }
  console.log("token in middleware:", token);
  try {
    const { verify } = jwt;
    const decoded: any = verify(token as string, process.env.JWT_SECRET_KEY!);
    const user = await userRepo.getOneUser({ email: decoded.email });
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

export const userController = {
  createUser,
  getAll,
  verification,
  signin,
  getAllCategory,
};
