"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = exports.resetPassword = exports.verifyUser = exports.otpGenerator = void 0;
const user_repo_1 = require("./user.repo");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const mailTemplate_1 = require("../../utils/mailTemplate");
//otpGenerator
function otpGenerator() {
    return Math.floor(100000 + Math.random() * 900000);
}
exports.otpGenerator = otpGenerator;
//get | query
const getAll = async (req, res) => {
    const currentPage = Number(req.query.page) || 1;
    const pageSize = Number(req.query.page_size) || 10;
    const offset = pageSize * (currentPage - 1);
    const searchVal = req.query.q;
    console.log("controller bhitra chiryo", { searchVal });
    try {
        if (!searchVal) {
            const users = await user_repo_1.userRepo.getAll(offset, pageSize);
            // console.log("search val chaina", { users });
            return res.json(users);
        }
        else {
            const users = await user_repo_1.userRepo.getAllWithSearch(offset, pageSize, String(searchVal));
            return res.json(users);
        }
    }
    catch (e) {
        console.log(e);
        return res.status(400).json({ e });
    }
};
//get of category
const getAllCategory = async (req, res) => {
    const currentPage = Number(req.query.page) || 1;
    const pageSize = Number(req.query.page_size) || 10;
    const offset = pageSize * (currentPage - 1);
    const searchVal = req.query.q;
    console.log("controller bhitra category chiryo", { searchVal });
    try {
        if (!searchVal) {
            const categories = await user_repo_1.userRepo.getAllCategory(offset, pageSize);
            // console.log("search val chaina", { categories });
            res.json(categories);
        }
        else {
            const category = await user_repo_1.userRepo.getAllWithSearchCategory(offset, pageSize, String(searchVal));
            return res.json(category);
        }
    }
    catch (e) {
        res.status(404).json({ e });
    }
};
//post | mutation for user
//signup
const createUser = async (req, res) => {
    const { email, fname, lname, password, phoneNumber, username } = req.body;
    try {
        const existingUser = await user_repo_1.userRepo.getOneUser({ email: email });
        if (existingUser) {
            return res.status(400).json({
                errorType: "User_already_exists",
                message: "User already exists",
            });
            // throw "user already exists";
        }
        const salt = bcrypt_1.default.genSaltSync(10);
        const hash = await bcrypt_1.default.hash(password, salt);
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
        const user = await user_repo_1.userRepo.createUser(userData);
        console.log({ user });
        const { sign } = jsonwebtoken_1.default;
        const token = sign({
            email: email,
            id: user.id,
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: "2m",
        });
        console.log({ aayoOTP: Otp });
        console.log({ accessToken: token });
        const link = `${process.env.BLOG_PAGE_DEPLOYMENT}?token=${token}`;
        // for mobile app ${Otp}`;
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
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS,
            },
        });
        let details = {
            from: "<no-reply>@techEra.io",
            to: email,
            subject: "Verify Your Account",
            html: (0, mailTemplate_1.emailBody)({ link, username, Otp }),
        };
        transporter.sendMail(details, (err) => {
            if (err) {
                console.log("errorr aayo sir", err);
            }
            else {
                console.log("chalyo sir");
            }
        });
        return res.status(200).json({ user, token, email });
    }
    catch (e) {
        console.error(e);
        return res.status(400).json({ error: "Failed to create user." });
    }
};
//signup verification iin web
const verification = async (req, res) => {
    const { token } = req.headers;
    console.log({ verificationToken: token });
    if (!token || typeof token !== "string") {
        return res.status(400).json({ error: "Invalid or expired token." });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        const user = await user_repo_1.userRepo.getOneUser({
            email: decoded.email,
        });
        if (user) {
            await user_repo_1.userRepo.verifyUser({
                email: decoded === null || decoded === void 0 ? void 0 : decoded.email,
            });
        }
        else {
            return res.status(404).json({ error: "user not found." });
        }
        console.log({ decoded });
        return res.status(200).json({ user, token });
    }
    catch (e) {
        console.error(e);
        return res.status(400).json({ error: "Invalid or expired token." });
    }
};
//signup verification in mobile through OTP
const otpVerification = async (req, res) => {
    var _a;
    const { otp, email } = req.body;
    console.log({ email, otp });
    if (!otp || typeof otp !== "string") {
        return res.status(400).json({ error: "Invalid or expired token." });
    }
    try {
        const user = await user_repo_1.userRepo.getOneUser({
            email,
        });
        if (((_a = user === null || user === void 0 ? void 0 : user.currentOTP) === null || _a === void 0 ? void 0 : _a.toString()) === otp.toString()) {
            await user_repo_1.userRepo.verifyUser({
                email,
            });
        }
        else {
            return res.status(404).json({ error: "user not found." });
        }
        return res.status(200).json({ user });
    }
    catch (e) {
        return res.status(400).json({ error: "Invalid." });
    }
};
//signin
const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await user_repo_1.userRepo.getOneUser({ email });
        if (!existingUser) {
            return res
                .status(400)
                .json({ errorType: "USER_NOT_FOUND", message: "User not found." });
        }
        if (!existingUser.isVerified) {
            const { sign } = jsonwebtoken_1.default;
            const token = sign({
                email: email,
                id: existingUser.id,
            }, process.env.JWT_SECRET_KEY, {
                expiresIn: "2m",
            });
            console.log({ accessToken: token });
            const link = `${process.env.BLOG_PAGE}?token=${token}`;
            const transporter = nodemailer_1.default.createTransport({
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
                }
                else {
                    console.log("chalyo sir");
                }
            });
            return res.status(400).json({
                errorType: "USER_NOT_VERIFIED",
                message: "user not verified",
                token,
            });
        }
        const matchPassword = bcrypt_1.default.compareSync(password, String(existingUser === null || existingUser === void 0 ? void 0 : existingUser.password));
        if (!matchPassword) {
            return res.status(400).json({
                errorType: "INVALID_CREDENTIALS",
                message: "Invalid credentials.",
            });
        }
        const { sign } = jsonwebtoken_1.default;
        const token = sign({ email: existingUser === null || existingUser === void 0 ? void 0 : existingUser.email, id: existingUser === null || existingUser === void 0 ? void 0 : existingUser.id }, process.env.JWT_SECRET_KEY
        // {
        //   expiresIn: "2m",
        // }
        );
        console.log({ existingUser });
        return res.status(200).json({ user: existingUser, token });
    }
    catch (e) {
        console.log(e);
        return res
            .status(400)
            .json({ errorType: "USER_NOT_FOUND", message: "User not found." });
    }
};
//middleware
const verifyUser = async (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(401).json({ message: "No token provided." });
    }
    try {
        console.log("token in middleware:", token);
        const { verify } = jsonwebtoken_1.default;
        const decoded = verify(token, process.env.JWT_SECRET_KEY);
        console.log({ decoded });
        const user = await user_repo_1.userRepo.getOneUser({ id: decoded.id });
        req.authUser = user;
        if (user) {
            next();
            // return res.status(201).json({ message: "nice intiative" });
        }
        else {
            return res.status(401).json({ message: "token invalid." });
        }
    }
    catch (e) {
        return res.status(401).json({ message: "token invalid." });
        // console.log(e);
    }
};
exports.verifyUser = verifyUser;
const resetPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const existingUser = await user_repo_1.userRepo.getOneUser({ email: email });
        if (existingUser) {
            const { sign } = jsonwebtoken_1.default;
            const token = sign({
                email: email,
            }, process.env.JWT_SECRET_KEY, { expiresIn: "2m" });
            const link = `${process.env.AUTH_PAGE_DEPLOYMENT}?token=${token}`;
            console.log(link);
            const transporter = nodemailer_1.default.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASS,
                },
            });
            let details = {
                from: "<no-reply>@techEra.io",
                to: email,
                subject: "Reseting Password",
                html: (0, mailTemplate_1.forgetPassword)({ email, link }),
            };
            transporter.sendMail(details, (err) => {
                if (err) {
                    console.log("errorr aayo sir", err);
                }
                else {
                    console.log("chalyo sir");
                }
            });
            return res.status(200).json({ message: "resetting password", token });
        }
        else {
            return res.status(404).json({ message: " existing user not found." });
        }
    }
    catch (e) {
        return res.status(401).json({ message: "email not exist." });
    }
};
exports.resetPassword = resetPassword;
//reset and updatig password
const updatePassword = async (req, res) => {
    console.log("hello");
    // const { token } = req.query;
    const { password, token } = req.body;
    console.log({ password }, { token });
    if (!token || typeof token !== "string") {
        return res.status(400).json({ error: "Invalid or expired token." });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        const email = decoded.email;
        const user = await user_repo_1.userRepo.getOneUser({ email: email });
        if (user) {
            const salt = bcrypt_1.default.genSaltSync(10);
            const hash = await bcrypt_1.default.hash(password, salt);
            await user_repo_1.userRepo.updatePassword(email, hash);
        }
        else {
            return res.status(404).json({ error: "user not found." });
        }
        console.log({ decoded });
        return res
            .status(200)
            .json({ messgae: "sucessfully updated the password", user, token });
    }
    catch (e) {
        console.error(e);
        return res.status(400).json({ error: "Invalid or expired token." });
    }
};
exports.userController = {
    createUser,
    getAll,
    verification,
    signin,
    resetPassword: exports.resetPassword,
    updatePassword,
    getAllCategory,
    verifyUser: exports.verifyUser,
    otpVerification,
};
