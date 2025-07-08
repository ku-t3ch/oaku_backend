import { Request, Response } from "express";
import { prisma } from "../configs/db";


export const createOrganization = async (req: Request, res: Response) => {
  const { nameTh, nameEn, publicOrganizationId, campusId, organizationTypeId } =
    req.body;
  if (!nameTh || !nameEn || !campusId || !organizationTypeId) {
    return res.status(400).json({
      error: "Name, campusId, and organizationType are required.",
    });
  }

  try {
    const campus = await prisma.campus.findUnique({
      where: { id: campusId },
    });

    const organizationType = await prisma.organizationType.findUnique({
      where: { id: organizationTypeId },
    });

    if (!organizationType) {
      return res.status(404).json({
        error: "Organization type not found.",
      });
    }

    if (!campus) {
      return res.status(404).json({
        error: "Campus not found.",
      });
    }

    if (publicOrganizationId) {
      const existingPublicId = await prisma.organization.findUnique({
        where: { publicOrganizationId: publicOrganizationId },
      });

      if (existingPublicId) {
        return res.status(409).json({
          error: "Organization with this public ID already exists.",
        });
      }
    }
    const newOrganization = await prisma.organization.create({
      data: {
        nameTh,
        nameEn,
        publicOrganizationId: publicOrganizationId || `ORG_${Date.now()}`, // auto-generate ถ้าไม่มี
        campusId,
        organizationTypeId,
        image: "", 
        details: "", 
        socialMedia: undefined, 
        email: "", 
        phoneNumber:  null,
      },
      include: {
        campus: true,
        organizationType: true,
      },
    });

    return res.status(201).json(newOrganization);
  } catch (error) {
    console.error("Error creating organization:", error);
    return res.status(500).json({
      error: "An error occurred while creating the organization.",
    });
  }
};


export const getAllOrganizations = async (req: Request, res: Response) => {
  try {
    const organizations = await prisma.organization.findMany({
      include: {
        campus: true,
        organizationType: true,
      },
    });

    return res.status(200).json(organizations);
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return res.status(500).json({
      error: "An error occurred while fetching organizations.",
    });
  }
}