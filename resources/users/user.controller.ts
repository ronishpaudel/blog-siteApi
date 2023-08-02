import { Request, Response } from "express";
import { userRepo } from "./user.repo";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
      res.json(users);
    } else {
      const users = await userRepo.getAllWithSearch(
        offset,
        pageSize,
        String(searchVal)
      );
      res.json(users);
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({ e });
  }
};
// const getEmail = async (req: Request, res: Response) => {
//   const { email } = req.body;
//   try {
//     const userEmail = {
//       email: email,
//     };
//     const users = await userRepo.getEmail(userEmail);
//     console.log({ users });
//     res.json(users);
//   } catch (e) {
//     console.log(e);
//     res.status(400).json({ e });
//   }
// };

//post | mutation
const createUser = async (req: Request, res: Response) => {
  try {
    const { email, fname, lname, password, companyName, phoneNumber } =
      req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = await bcrypt.hash(password, salt);
    const userData = {
      email: email,
      fname: fname,
      lname: lname,
      password: hash,
      companyName: companyName,
      phoneNumber: phoneNumber,
    };
    const user = await userRepo.createUser(userData);
    console.log(user);
    const { sign } = jwt;
    const accessToken = sign(
      {
        email: email,
        iat: Math.floor(Date.now() / 1000) - 30,
      },
      process.env.JWT_SECRET_KEY!
    );
    const link = `${process.env.BLOG_PAGE}?token=${accessToken}`;
    console.log({ link });
    res.json(user);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: "Failed to create user." });
  }
};

// const updateUserVerified = async (req: Request, res: Response) => {
//   const { email, isVerified } = req.body;
//   try {
//     const userEmail = {
//       email: email,
//     };
//     const userIsVerified = {
//       isVerified: isVerified === true,
//     };
//     const updateUser = await userRepo.updateUserVerified(
//       userEmail,
//       userIsVerified
//     );
//     res.json(updateUser);
//   } catch (e) {}
// };

export const userController = {
  createUser,
  getAll,
  // updateUserVerified,
};
