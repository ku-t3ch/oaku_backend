import { prisma } from "../configs/db";
import { Request, Response } from "express";
import {
  uploadFileActivityHoursAndReturnUrl,
  getFromS3,
} from "./file.controller";
import { Readable } from "stream";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../utils/s3";

export const uploadActivityHour = async (
  req: Request & { file?: Express.Multer.File },
  res: Response
) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { projectId, userId } = req.body;
    if (!projectId || !userId) {
      return res
        .status(400)
        .json({ message: "projectId และ userId ต้องไม่เป็นค่าว่าง" });
    }

    const file = req.file;
    const key = `activity-hours/${projectId}/${file.originalname}`;
    const url = await uploadFileActivityHoursAndReturnUrl(
      key,
      file.buffer,
      file.mimetype
    );

    // เพิ่ม fileUrl ในการสร้าง record
    const activityHour = await prisma.activityHourFile.create({
      data: {
        fileNamePrinciple: file.originalname,
        fileUrl: url,
        projectId,
        userId,
        isCompleted: false,
      },
    });

    await prisma.project.update({
      where: { id: projectId },
      data: { status: "IN_PROGRESS" },
    });

    return res.status(200).json({ url, activityHour });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
};

export const getActivityHourFile = async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    const key = `activity-hours/${filename}`;
    const fileStream = await getFromS3(key);

    if (!fileStream) {
      return res.status(404).json({ message: "File not found" });
    }

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    const stream = (fileStream as any).Body ?? fileStream;
    if (stream && typeof stream.pipe === "function") {
      stream.pipe(res);
    } else {
      try {
        Readable.from(stream as any).pipe(res);
      } catch {
        return res.status(500).json({ message: "Cannot stream file" });
      }
    }
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
};

export const deleteActivityHourFile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Find the file record
    const activityHourFile = await prisma.activityHourFile.findUnique({
      where: { id },
    });

    if (!activityHourFile) {
      return res.status(404).json({ message: "ActivityHourFile not found" });
    }

    // Delete from S3
    const key = `activity-hours/${activityHourFile.projectId}/${activityHourFile.fileNamePrinciple}`;
    try {
      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.S3_BUCKET,
          Key: key,
        })
      );
    } catch (err) {
      // Ignore S3 error, file may already be deleted
      console.warn("File not found in S3 or already deleted:", key);
    }

    // Delete from DB
    await prisma.activityHourFile.delete({
      where: { id },
    });

    const remainingFiles = await prisma.activityHourFile.count({
      where: { projectId: activityHourFile.projectId },
    });
    if (remainingFiles === 0) {
      await prisma.project.update({
        where: { id: activityHourFile.projectId },
        data: { status: "PADDING" },
      });
    }

    return res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
};

export const downloadActivityHourFile = async (req: Request, res: Response) => {
  const { projectId, fileNamePrinciple } = req.params;
  const key = `activity-hours/${projectId}/${fileNamePrinciple}`;

  try {
    const fileStream = await getFromS3(key);

    if (!fileStream) {
      return res.status(404).json({ message: "File not found" });
    }

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileNamePrinciple}"`
    );
    res.setHeader("Content-Type", "text/csv");

    if (fileStream && typeof (fileStream as any).pipe === "function") {
      (fileStream as any).pipe(res);
    } else {
      try {
        Readable.from(fileStream as any).pipe(res);
      } catch {
        return res.status(500).json({ message: "Cannot stream file" });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};
