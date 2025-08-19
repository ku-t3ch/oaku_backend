import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  region: "ap-southeast-1",
  endpoint: `https://${process.env.S3_HOST}`,
  credentials: {
    accessKeyId: process.env.S3_ACCESS!,
    secretAccessKey: process.env.S3_SECRET!,
  },
  forcePathStyle: true, 
});