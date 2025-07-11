import { prisma } from "../configs/db";
import { Request, Response } from "express";

export const getOrganizations = async (req: Request, res: Response) => {
  const { campusId, organizationTypeId } = req.query;

  try {
    const where: any = {};
    if (campusId) where.campusId = campusId as string;
    if (organizationTypeId)
      where.organizationTypeId = organizationTypeId as string;

    const organizations = await prisma.organization.findMany({
      where,
      include: {
        campus: true,
        organizationType: true,
      },
    });
    res.status(200).json(organizations);
  } catch (error) {
    console.error("Error fetching organizations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const createOrganization = async (req: Request, res: Response) => {
  const {
    nameEn,
    nameTh,
    campusId,
    organizationTypeId,
    publicOrganizationId,
    image,
    details,
    email,
    phoneNumber,
    socialMedia, // รับเป็น array/object เช่น [{ platform: "Facebook", url: "..." }]
  } = req.body;

  if (
    !nameEn ||
    !nameTh ||
    !campusId ||
    !organizationTypeId ||
    !publicOrganizationId ||
    !image ||
    !details ||
    !email
  ) {
    return res.status(400).json({
      error:
        "nameEn, nameTh, campusId, organizationTypeId, publicOrganizationId, image, details, and email are required",
    });
  }

  try {
    const newOrganization = await prisma.organization.create({
      data: {
        nameEn: nameEn.trim(),
        nameTh: nameTh.trim(),
        campusId,
        organizationTypeId,
        publicOrganizationId,
        image,
        details,
        email,
        phoneNumber: phoneNumber || null,
        socialMedia: socialMedia || null, 
      },
      include: {
        campus: true,
        organizationType: true,
      },
    });
    res.status(201).json(newOrganization);
  } catch (error: any) {
    if (error.code === "P2002") {
      // Prisma unique constraint failed
      return res
        .status(409)
        .json({ error: "Duplicate email or publicOrganizationId" });
    }
    console.error("Error creating organization:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
