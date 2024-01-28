import { NextFunction, Request, Response } from "express";
import { userRepo } from "./user.repo";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import nodemailer from "nodemailer";

//otpGenerator
export function otpGenerator() {
  return Math.floor(100000 + Math.random() * 900000);
}

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
  const { email, fname, lname, password, phoneNumber, username } = req.body;

  try {
    const existingUser = await userRepo.getOneUser({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
      // throw "user already exists";
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = await bcrypt.hash(password, salt);
    const Otp = otpGenerator();
    const userData = {
      email: email,
      username,
      fname: fname,
      password: hash,
      lname: lname,
      phoneNumber: String(phoneNumber),
      currentOTP: Otp,
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

    console.log({ aayoOTP: Otp });
    console.log({ accessToken: token });
    const link = `${process.env.BLOG_PAGE_DEPLOYEMENT}?token=${token} for mobile app ${Otp}`;
    //BLOG_PAGE_DEPLOYMENT for vercel and for production BLOG_PAGE_PRODUCTION
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

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,

        pass: process.env.PASS,
      },
    });
    let details = {
      from: "<no-reply>@techEra.io",
      to: email,
      subject: "testing nodemailer with gmail",
      text: `Hello world?${link}`,
    };
    transporter.sendMail(details, (err) => {
      if (err) {
        console.log("errorr aayo sir", err);
      } else {
        console.log("chalyo sir");
      }
    });
    return res.status(200).json({ user, token, email });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ error: "Failed to create user." });
  }
};

//signup verification iin web
const verification = async (req: Request, res: Response) => {
  const { token } = req.headers;
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

//signup verification in mobile through OTP
const otpVerification = async (req: Request, res: Response) => {
  const { otp, email } = req.body;
  console.log({ email, otp });
  if (!otp || typeof otp !== "string") {
    return res.status(400).json({ error: "Invalid or expired token." });
  }
  try {
    const user = await userRepo.getOneUser({
      email,
    });
    if (user?.currentOTP?.toString() === otp.toString()) {
      await userRepo.verifyUser({
        email,
      });
    } else {
      return res.status(404).json({ error: "user not found." });
    }
    console.log({ user });
    return res.status(200).json({ user });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ error: "Invalid." });
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
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,

          pass: process.env.PASS,
        },
      });
      let details = {
        from: "<no-reply>@techEra.io",
        to: email,
        subject: "testing nodemailer with gmail",
        text: `Hello world?${link}`,
      };
      transporter.sendMail(details, (err) => {
        if (err) {
          console.log("errorr aayo sir", err);
        } else {
          console.log("chalyo sir");
        }
      });
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
    console.log({ existingUser });
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
      const token = sign(
        {
          email: email,
        },
        process.env.JWT_SECRET_KEY!
      );
      const link = `${process.env.AUTH_PAGE}?token=${token}`;
      console.log(link);
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,

          pass: process.env.PASS,
        },
      });
      let details = {
        from: "<no-reply>@techEra.io",
        to: email,
        subject: "testing nodemailer with gmail",
        text: `Hello world?${link}`,
      };
      transporter.sendMail(details, (err) => {
        if (err) {
          console.log("errorr aayo sir", err);
        } else {
          console.log("chalyo sir");
        }
      });
      return res.status(200).json({ message: "resetting password", token });
    } else {
      return res.status(404).json({ message: " existing user not found." });
    }
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
      .json({ messgae: "sucessfully updated the password", user, token });
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
  otpVerification,
};
