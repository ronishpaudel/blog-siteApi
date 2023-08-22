import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuid } from "uuid";

async function s3Upload() {
  const BUCKET_NAME = "testing-todo";
  const BUCKET_URL = "https://testing-todo.s3.ap-south-1.amazonaws.com";
  const FOLDER_NAME = "blog_images";
  const id = uuid();
  const command = new PutObjectCommand({
    ACL: "public-read",
    Bucket: BUCKET_NAME,
    Key: `/${FOLDER_NAME}/${id}.jpg`,
  });
  // console.log(process.env.ACCESS_KEY);
  const imageClient = new S3Client({
    region: "ap-south-1",
    credentials: {
      accessKeyId: process.env.ACCESS_KEY!!,
      secretAccessKey: process.env.SECRET_ACCESS_KEY!!,
    },
  });
  try {
    const uploadUrl = await getSignedUrl(imageClient, command, {
      expiresIn: 60 * 30,
    });
    console.log({ uploadUrl });
    const url = `${BUCKET_URL}//${FOLDER_NAME}/${id}.jpg`;
    return { uploadUrl, url };
  } catch (e) {
    return;
  }
}

export { s3Upload };
