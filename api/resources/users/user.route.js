"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const express_1 = __importDefault(require("express"));
const _1 = require(".");
const user_controller_1 = require("./user.controller");
const userRoute = express_1.default.Router();
exports.userRoute = userRoute;
// Query ROUTES
userRoute.get("/user", user_controller_1.verifyUser, async (req, res) => {
    await _1.userController.getAll(req, res);
});
userRoute.get("/user/category", async (req, res) => {
    await _1.userController.getAllCategory(req, res);
});
userRoute.get("/user/me", user_controller_1.verifyUser, async (req, res) => {
    try {
        const { id, username, email } = req.authUser;
        return res.status(200).json({ id, username, email });
    }
    catch (error) {
        return res.status(500).json({ message: " server error." });
    }
});
//mutation route
userRoute.post("/user/signup", async (req, res) => {
    await _1.userController.createUser(req, res);
});
//verification through jwt
userRoute.post("/user/email-confirm", async (req, res) => {
    await _1.userController.verification(req, res);
});
//login
userRoute.post("/user/signin", async (req, res) => {
    await _1.userController.signin(req, res);
});
userRoute.post("/user/reset-password", async (req, res) => {
    await _1.userController.resetPassword(req, res);
});
userRoute.post("/user/update-password", async (req, res) => {
    await _1.userController.updatePassword(req, res);
});
userRoute.post("/user/otp-verify", async (req, res) => {
    await _1.userController.otpVerification(req, res);
});
