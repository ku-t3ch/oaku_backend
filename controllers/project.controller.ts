import { prisma } from "../configs/db";
import { uploadFileActivityHoursAndReturnUrl } from "./file.controller";
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

export const getProjectById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const project = await prisma.project.findUnique({
      where: { id },
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
       activityHourFiles: true, 
        
      },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(200).json(project);
  } catch (error) {
    console.error("Error fetching project by id:", error);
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
      complianceStandards,
      kasetsartStudentIdentities,
      sustainableDevelopmentGoals,
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
        complianceStandards,
        kasetsartStudentIdentities,
        sustainableDevelopmentGoals,
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

export const uploadFileActivityHourInProject = async (
  req: Request,
  res: Response
) => {
  try {
    const { projectId } = req.params;
    const { userId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "File is required" });
    }
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    // Upload file to S3 and get URL
    const fileUrl = await uploadFileActivityHoursAndReturnUrl(
      `activity-hours/${projectId}/${file.originalname}`,
      file.buffer,
      file.mimetype
    );

    // สร้าง record ใหม่ใน ActivityHourFile
    const activityHourFile = await prisma.activityHourFile.create({
      data: {
        fileNamePrinciple: file.originalname,
        fileUrl: fileUrl, // เพิ่มบรรทัดนี้
        projectId,
        userId,
        isCompleted: false,
      },
    });

    // อัปเดตสถานะ Project
    const project = await prisma.project.update({
      where: { id: projectId },
      data: { status: "IN_PROGRESS" },
      include: {
        activityHourFiles: true, // ถ้า schema มี relation นี้
      },
    });

    

    return res.status(201).json({ activityHourFile, project });
  } catch (error) {
    console.error("Error uploading file for activity hours:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const completeActivityHourInProject = async (
  req: Request,
  res: Response
) => {
  const { activityHourFileId, projectId } = req.params;

  try {
    // อัปเดต activity hour file
    const activityHour = await prisma.activityHourFile.update({
      where: { id: activityHourFileId },
      data: { isCompleted: true },
    });

    // อัปเดตสถานะ Project
    const project = await prisma.project.update({
      where: { id: projectId },
      data: { status: "COMPLETED" },
    });

    return res.status(200).json({ activityHour, project });
  } catch (error) {
    console.error("Error completing activity hour:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
