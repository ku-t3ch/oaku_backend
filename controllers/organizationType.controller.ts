import { prisma } from "../configs/db";
import { Request, Response } from "express";

export const getOrganizationTypes = async (req: Request, res: Response) => {
  try {
    const organizationTypes = await prisma.organizationType.findMany({
      include: {
        organizations: {
          include: {
            campus: true,
          },
        },
      },
    });
    res.status(200).json(organizationTypes);
  } catch (error) {
    console.error("Error fetching organization types:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getOrganizationsByCampusId = async (
  req: Request,
  res: Response
) => {
  const { campusId } = req.query;

  if (!campusId) {
    return res.status(400).json({ error: "campusId is required" });
  }

  try {
    const organizations = await prisma.organization.findMany({
      where: { campusId: campusId as string },
      include: {
        campus: true,
        organizationType: true,
      },
    });
    res.status(200).json(organizations);
  } catch (error) {
    console.error("Error fetching organizations by campusId:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
