"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3Upload = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const uuid_1 = require("uuid");
async function s3Upload() {
    const BUCKET_NAME = "testing-todo";
    const BUCKET_URL = "https://testing-todo.s3.ap-south-1.amazonaws.com";
    const FOLDER_NAME = "blog_images";
    const id = (0, uuid_1.v4)();
    const command = new client_s3_1.PutObjectCommand({
        ACL: "public-read",
        Bucket: BUCKET_NAME,
        Key: `/${FOLDER_NAME}/${id}.jpg`,
    });
    // console.log(process.env.ACCESS_KEY);
    const imageClient = new client_s3_1.S3Client({
        region: "ap-south-1",
        credentials: {
            accessKeyId: process.env.ACCESS_KEY,
            secretAccessKey: process.env.SECRET_ACCESS_KEY,
        },
    });
    try {
        const uploadUrl = await (0, s3_request_presigner_1.getSignedUrl)(imageClient, command, {
            expiresIn: 60 * 30,
        });
        console.log({ uploadUrl });
        const url = `${BUCKET_URL}//${FOLDER_NAME}/${id}.jpg`;
        return { uploadUrl, url };
    }
    catch (e) {
        return;
    }
}
exports.s3Upload = s3Upload;
