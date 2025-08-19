import { prisma } from "../configs/db";
import { Request, Response } from "express";

export const getAllCampus = async (req: Request, res: Response) => {
  try {
    const campuses = await prisma.campus.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    res.status(200).json(campuses);
  } catch (error) {
    console.error("Error fetching campus:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
