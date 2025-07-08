import { Request, Response } from "express";
import { prisma } from "../configs/db";
import { Role, Position } from "@prisma/client";

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const getAllUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const currentUser = req.user;

    const isAdmin = currentUser.userRoles?.some((role: any) => 
      role.role === "CAMPUS_ADMIN" || role.role === "SUPER_ADMIN"
    );

    if (!isAdmin) {
      return res.status(403).json({
        error: "Access denied. Admin role required.",
      });
    }

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
};

export const addRoleAdminToUser = async (req: Request, res: Response) => {
  const { userId, role } = req.params;
  const { campusId } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (role !== "CAMPUS_ADMIN" && role !== "SUPER_ADMIN") {
      return res.status(400).json({
        error: "Invalid role. Only CAMPUS_ADMIN and SUPER_ADMIN are allowed.",
      });
    }

    if (role === "CAMPUS_ADMIN" && !campusId) {
      return res.status(400).json({
        error: "Campus ID is required for CAMPUS_ADMIN role.",
      });
    }

    if (role === "CAMPUS_ADMIN") {
      const campus = await prisma.campus.findUnique({
        where: { id: campusId },
      });

      if (!campus) {
        return res.status(404).json({ error: "Campus not found" });
      }
    }

    const existingRole = await prisma.userRole.findFirst({
      where: {
        userId: userId,
        role: role as Role,
        campusId: role === "CAMPUS_ADMIN" ? campusId : null,
      },
    });

    if (existingRole) {
      return res.status(409).json({
        error: "User already has this role",
      });
    }

    const newUserRole = await prisma.userRole.create({
      data: {
        userId: userId,
        role: role as Role,
        campusId: role === "CAMPUS_ADMIN" ? campusId : null,
      },
      include: {
        campus: true,
      },
    });

    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
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

    return res.status(200).json({
      message: "Admin role added successfully",
      user: updatedUser,
      newRole: newUserRole,
    });
  } catch (error) {
    console.error("Error adding admin role:", error);
    return res.status(500).json({
      error: "An error occurred while adding admin role.",
    });
  }
};

const getUserByRole = async (userId: string, role: Role) => {
  if (role === "USER") {
    return await prisma.user.findUnique({
      where: { id: userId },
      include: {
        campus: true,
        userOrganizations: {
          where: { role: "USER" },
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
  } else {
    return await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          where: { role },
          include: {
            campus: true,
          },
        },
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
  }
};
