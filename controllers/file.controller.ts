import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../utils/s3";
import { csvExecute } from "../utils/validation";

export async function getS3SignedUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
  });
  return getSignedUrl(s3, command);
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

export async function uploadPdfDocAndReturnUrl(
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

export async function deleteFileActivityHours(key: string) {
  if (!key.endsWith(".csv")) {
    throw new Error("File is not a CSV");
  }
  const command = new DeleteObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
  });
  await s3.send(command);
  return { success: true, message: "CSV file deleted" };
}

export async function deletePdfDoc(key: string) {
  if (!key.endsWith(".pdf")) {
    throw new Error("File is not a PDF");
  }
  const command = new DeleteObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
  });
  await s3.send(command);
  return { success: true, message: "PDF file deleted" };
}
