import { prisma } from "../configs/db";
import { Request, Response } from "express";

// ฟังก์ชันเดียว รองรับทั้ง get organization types และ filter organizations by campusId
export const getOrganizationTypes = async (req: Request, res: Response) => {
  const { campusId } = req.query;

  try {
    if (campusId) {
      // ถ้ามี campusId ให้ filter organizations ตาม campusId
      const organizations = await prisma.organization.findMany({
        where: { campusId: campusId as string },
        include: {
          campus: true,
          organizationType: true,
        },
      });
      return res.status(200).json(organizations);
    } else {
      // ถ้าไม่มี campusId ให้ดึง organization types ทั้งหมด พร้อม organizations และ campus
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
    console.error("Error fetching organization types or organizations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
