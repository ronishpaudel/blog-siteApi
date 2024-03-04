"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sesClient = void 0;
const client_ses_1 = require("@aws-sdk/client-ses");
const REGION = "ap-south-1";
exports.sesClient = new client_ses_1.SESClient({
    region: REGION,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
});
