import { prisma } from "../configs/db";
import { Request, Response } from "express";
import { uploadFileActivityHoursAndReturnUrl, getFromS3 } from "./file.controller";
import { Readable } from "stream";

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
      return res.status(400).json({ message: "projectId และ userId ต้องไม่เป็นค่าว่าง" });
    }

    const file = req.file;
    const key = `activity-hours/${file.originalname}`;
    const url = await uploadFileActivityHoursAndReturnUrl(
      key,
      file.buffer,
      file.mimetype
    );


    const activityHour = await prisma.activityHour.create({
      data: {
        fileNamePrinciple: file.originalname,
        projectId,
        userId,
        isCompleted: false,
      },
    });

    return res.status(200).json({ url, activityHour });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
};

export const getActivityHourFile = async (
  req: Request,
  res: Response
) => {
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
    } else if (stream && typeof stream[Symbol.asyncIterator] === "function") {
      Readable.from(stream).pipe(res);
    } else {
      return res.status(500).json({ message: "Cannot stream file" });
    }
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
};