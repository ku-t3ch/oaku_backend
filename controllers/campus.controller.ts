import { Request, Response } from "express";
import { prisma } from "../configs/db";

export const getAllCampuses = async (req: Request, res: Response) => {
  try {
    const campuses = await prisma.campus.findMany({
        select:{
            name: true,
            id: true,
        }
    });

    return res.status(200).json(campuses);
  } catch (error) {
    console.error("Error fetching campuses:", error);
    return res.status(500).json({
      error: "An error occurred while fetching campuses.",
    });
  }
};


