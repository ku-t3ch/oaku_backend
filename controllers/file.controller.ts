import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../utils/s3";

export async function uploadImageOrganization(key: string, body: Buffer | string, contentType?: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
  });
  await s3.send(command);
}

export async function uploadFileActivityHours(key: string, body: Buffer | string, contentType?: string) {
    const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
  });
  await s3.send(command);
}


export async function getFromS3(key: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: key,
  });
  const response = await s3.send(command);
  return response.Body; 
}