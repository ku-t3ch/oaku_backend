import { Request, Response } from "express";
import { prisma } from "../configs/db";
import { Role, Position } from "@prisma/client";


export const createUser = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      name,
      email,
      phoneNumber,
      campusId,
      role,
      position,
      organizationId,
    } = req.body;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ userId: userId }, { email: email }],
      },
    });
    const campus = await prisma.campus.findUnique({
      where: { id: campusId },
    });

    const userData: any = {
      userId,
      name,
      email,
      phoneNumber,
      campusId,
    };

    if (!userId || !name || !email || !campusId) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["userId", "name", "email", "campusId"],
      });
    }

    if (!organizationId) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["organizationId"],
      });
    }

    if (existingUser) {
      return res.status(400).json({
        error: "User already exists with this userId or email",
      });
    }

    if (!campus) {
      return res.status(404).json({
        error: "Campus not found",
      });
    }

    let organization = null;
    if (organizationId) {
      organization = await prisma.organization.findUnique({
        where: { id: organizationId },
      });

      if (!organization) {
        return res.status(404).json({
          error: "Organization not found",
        });
      }
    }

    if (organizationId && organization) {
      userData.userOrganizations = {
        create: {
          userIdCode: userId,
          organizationIdCode: organization.publicOrganizationId,
          organizationId: organizationId,
          role: role as Role,
          position: position as Position,
        },
      };
    }

    const newUser = await prisma.user.create({
      data: userData,
      include: {
        campus: true,
        userOrganizations: {
          include: {
            organization: {
              include: {
                campus: true,
                organizationType: true,
              },
            },
          },
        },
      },
    });

    return res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);

    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2002") {
        return res.status(400).json({
          error: "User with this userId or email already exists",
        });
      }

      if (error.code === "P2003") {
        return res.status(400).json({
          error: "Invalid campusId provided",
        });
      }
    }

    return res.status(500).json({
      error: "An error occurred while creating the user.",
    });
  }
};


export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        campus: true,
        userOrganizations: {
          include: {
            organization: {
              include: {
                campus: true,
                organizationType: true,
              },
            },
          },
        },
        userRoles: {
          include: {
            campus: true,
          },
        },
      },
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      error: "An error occurred while fetching users.",
    });
  }
}