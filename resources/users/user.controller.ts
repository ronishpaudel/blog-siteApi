import { Request, Response } from "express";
import { userRepo } from "./user.repo";
import bcrypt, { genSalt } from "bcrypt";

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
    res.json(user);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: "Failed to create user." });
  }
};
export const userController = {
  createUser,
  getAll,
};
