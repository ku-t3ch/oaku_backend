import { prisma } from "../configs/db";
import { Request, Response } from "express";
import { uploadImageOrganizationAndReturnUrl } from "./file.controller";

export const getOrganizations = async (req: Request, res: Response) => {
  const { campusId, organizationTypeId } = req.query;

  try {
    const where: any = {};
    if (campusId) where.campusId = campusId as string;
    if (organizationTypeId) where.organizationTypeId = organizationTypeId as string;

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

export const editOrganization = async (
  req: Request & { file?: Express.Multer.File },
  res: Response
) => {
  const { id } = req.params;
  const {
    nameEn,
    nameTh,
    campusId,
    organizationTypeId,
    publicOrganizationId,
    email,
    phoneNumber,
    details,
    socialMedia,
  } = req.body;

  try {

    const org = await prisma.organization.findUnique({ where: { id } });
    if (!org) {
      return res.status(404).json({ error: "Organization not found" });
    }


    let imageToUpdate = org.image;
    if (req.file) {
      const key = `organization/${id}/$${req.file.originalname}`;
      imageToUpdate = await uploadImageOrganizationAndReturnUrl(
        key,
        req.file.buffer,
        req.file.mimetype
      );
    } else if (typeof req.body.image === "string") {
      imageToUpdate = req.body.image.trim() === "" ? org.image : req.body.image;
    }

    // อัปเดตข้อมูล
    const updated = await prisma.organization.update({
      where: { id },
      data: {
        nameEn: nameEn?.trim() ?? org.nameEn,
        nameTh: nameTh?.trim() ?? org.nameTh,
        campusId: campusId ?? org.campusId,
        organizationTypeId: organizationTypeId ?? org.organizationTypeId,
        publicOrganizationId: publicOrganizationId ?? org.publicOrganizationId,
        email: email ?? org.email,
        phoneNumber: phoneNumber ?? org.phoneNumber,
        image: imageToUpdate,
        details: details ?? org.details,
        socialMedia: socialMedia ?? org.socialMedia,
      },
      include: {
        campus: true,
        organizationType: true,
      },
    });

    res.status(200).json(updated);
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Duplicate unique field" });
    }
    console.error("Error editing organization:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createOrganization = async (req: Request, res: Response) => {
  const { nameEn, nameTh, campusId, organizationTypeId, publicOrganizationId } = req.body;

  if (
    !nameEn ||
    !nameTh ||
    !campusId ||
    !organizationTypeId ||
    !publicOrganizationId
  ) {
    return res.status(400).json({
      error: "nameEn, nameTh, campusId, organizationTypeId, publicOrganizationId are required",
    });
  }

  try {
    const existing = await prisma.organization.findFirst({
      where: {
        OR: [
          { nameEn: nameEn.trim() },
          { nameTh: nameTh.trim() },
          { publicOrganizationId },
        ],
      },
    });
    if (existing) {
      return res.status(409).json({
        error: "Organization name or publicOrganizationId already exists",
      });
    }

    const newOrganization = await prisma.organization.create({
      data: {
        nameEn: nameEn.trim(),
        nameTh: nameTh.trim(),
        campusId,
        organizationTypeId,
        publicOrganizationId,
        image: req.body.image || "",
        details: req.body.details || "",
        email: req.body.email || "",
      },
      include: {
        campus: true,
        organizationType: true,
      },
    });
    res.status(201).json(newOrganization);
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Duplicate organization or publicOrganizationId" });
    }
    console.error("Error creating organization:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getOrganizationsAndUserInOrganizationById = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  try {
    const organization = await prisma.organization.findUnique({
      where: { id },
      include: {
        campus: true,
        organizationType: true,
        userOrganizations: {
          select: {
            id: true,
            role: true,
            isSuspended: true,
            position: true,
            user: {
              select: {
                id: true,
                userId: true,
                name: true,
                email: true,
                phoneNumber: true,
                image: true,
                isSuspended: true,
              },
            },
          },
        },
      },
    });

    if (!organization) {
      return res.status(404).json({ error: "Organization not found" });
    }

    res.status(200).json(organization);
  } catch (error) {
    console.error("Error fetching organization:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};