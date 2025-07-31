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

export const getAllOrganizationsType = async (req: Request, res: Response) => {
  try {
    const organizationsType = await prisma.organizationType.findMany({
      select: {
        id: true,
        name: true,
        campus: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    res.status(200).json(organizationsType);
  } catch (error) {
    console.error("Error fetching organization types:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllOrganizations = async (req: Request, res: Response) => {
  try {
    const organizations = await prisma.organization.findMany({
      select: {
        id: true,
        email: true,
        phoneNumber: true,
        nameEn: true,
        nameTh: true,
        details: true,
        socialMedia: true,
        image: true,
        campus: {
          select: {
            id: true,
            name: true,
          },
        },
        organizationType: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    res.status(200).json(organizations);
  } catch (error) {
    console.error("Error fetching organizations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      select: {
        publicProjectId: true,
        nameEn: true,
        nameTh: true,
        schedule: true,
        dateStart: true,
        dateEnd: true,
        location: true,
        principlesAndReasoning: true,
        activityFormat: true,
        activityHours: true,
        expectedProjectOutcome: true,
        objectives: true,
        campus: {
          select: {
            id: true,
            name: true,
          },
        },
        organization: {
            select: {
                id: true,
                nameEn: true,
                nameTh: true,
                image: true,
            },
        },
      },
    });
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
