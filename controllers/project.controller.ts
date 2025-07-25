import { prisma } from "../configs/db";
import { Request, Response } from "express";

export const getProjects = async (req: Request, res: Response) => {

  const { campusId, organizationTypeId, organizationId } = req.query;

  try {
    const projects = await prisma.project.findMany({
      where: {
        ...(campusId && { campusId: campusId as string }),
        ...(organizationTypeId && {
          organization: {
            organizationTypeId: organizationTypeId as string,
          },
        }),
        ...(organizationId && { organizationId: organizationId as string }),
      },
      include: {
        organization: {
          select: {
            id: true,
            nameEn: true,
            nameTh: true,
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
        },
        campus: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const {
      activityCode,
      nameEn,
      nameTh,
      dateStart,
      dateEnd,
      targetUser,
      participants,
      schedule,
      principlesAndReasoning,
      status,
      budgetUsed,
      objectives,
      activityFormat,
      expectedProjectOutcome,
      location,
      organizationId,
      campusId,
      activityHours,
    } = req.body;

    const project = await prisma.project.create({
      data: {
        activityCode,
        nameEn,
        nameTh,
        dateStart: new Date(dateStart),
        dateEnd: new Date(dateEnd),
        targetUser,
        participants,
        schedule,
        principlesAndReasoning,
        status,
        budgetUsed,
        objectives,
        activityFormat,
        expectedProjectOutcome,
        location,
        organizationId,
        campusId,
        activityHours,
      },
    });

    return res.status(201).json(project);
  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
