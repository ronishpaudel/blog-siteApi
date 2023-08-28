import { SESClient } from "@aws-sdk/client-ses";
const REGION = "ap-south-1";
export const sesClient = new SESClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY!!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!!,
  },
});
