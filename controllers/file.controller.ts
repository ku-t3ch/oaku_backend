import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../utils/s3";
import { csvExecute } from "../utils/validation";

export async function getS3SignedUrl(key: string, expiresInSeconds = 3600) {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
  });
  return getSignedUrl(s3, command, { expiresIn: expiresInSeconds });
}

export async function uploadImageOrganizationAndReturnUrl(
  key: string,
  body: Buffer | string,
  contentType?: string
) {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
  });
  await s3.send(command);
  return getS3SignedUrl(key);
}

export async function uploadFileActivityHoursAndReturnUrl(
  key: string,
  body: Buffer | string,
  contentType?: string
) {

  if (contentType === "text/csv" || key.endsWith(".csv")) {
    try {
      await csvExecute(body); 
    } catch (err) {
      throw new Error(`CSV format invalid: ${(err as Error).message}`);
    }
  }

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
  });
  await s3.send(command);
  return getS3SignedUrl(key);
}

export async function getFromS3(key: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
  });
  const response = await s3.send(command);
  return response.Body;
}