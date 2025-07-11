import { prisma } from "../configs/db";
import { Request, Response } from "express";

export const getOrganizationTypes = async (req: Request, res: Response) => {
  const { campusId } = req.query;

  try {
    if (campusId) {
      // ดึง organizationTypes เฉพาะ campusId ที่เลือก
      const organizationTypes = await prisma.organizationType.findMany({
        where: { campusId: campusId as string },
        include: {
          organizations: {
            include: {
              campus: true,
            },
          },
        },
      });
      return res.status(200).json(organizationTypes);
    } else {
      // ดึง organizationTypes ทั้งหมด
      const organizationTypes = await prisma.organizationType.findMany({
        include: {
          organizations: {
            include: {
              campus: true,
            },
          },
        },
      });
      return res.status(200).json(organizationTypes);
    }
  } catch (error) {
    console.error("Error fetching organization types:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
