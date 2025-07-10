import { Request, Response } from "express";
import { prisma } from "../configs/db";
import { User } from "../types/user";
import {
  Role,
  Position,
  Campus,
  UserOrganization,
  Organization,
  OrganizationType,
  UserRole,
} from "@prisma/client";

type UserWithRelations = User & {
  campus: Campus;
  userOrganizations: (UserOrganization & {
    organization: Organization & {
      campus: Campus;
      organizationType: OrganizationType;
    };
  })[];
  userRoles: (UserRole & {
    campus: Campus | null;
  })[];
  


};

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const getAllUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const currentUser = req.user;

    const isAdmin = currentUser.userRoles?.some(
      (role: any) => role.role === "CAMPUS_ADMIN" || role.role === "SUPER_ADMIN"
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
  const { campusId, action } = req.body; // เพิ่ม action

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

    // ถ้า action เป็น remove ให้ลบ role
    if (action === "remove") {
      const deleted = await prisma.userRole.deleteMany({
        where: {
          userId: userId,
          role: role as Role,
          campusId: role === "CAMPUS_ADMIN" ? campusId : null,
        },
      });

      if (deleted.count === 0) {
        return res.status(404).json({ error: "Role not found for user" });
      }

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
        message: "Admin role removed successfully",
        user: updatedUser,
      });
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
    console.error("Error adding/removing admin role:", error);
    return res.status(500).json({
      error: "An error occurred while adding/removing admin role.",
    });
  }
};

export const getAllUsersByRoleORCampus = async (
  req: Request,
  res: Response
) => {
  const { role, campusId } = req.query;
  if (!role && !campusId) {
    return res.status(400).json({
      error: "At least one of role or campusId is required.",
    });
  }

  try {
    const includeOptions = {
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
    };

    let whereClause: any = {};

    if (role && campusId) {
      const roleStr = role as string;

      if (roleStr === "USER") {
        whereClause = {
          AND: [
            { campusId: campusId as string },
            {
              userOrganizations: {
                some: {
                  role: "USER" as Role,
                  organization: {
                    campusId: campusId as string,
                  },
                },
              },
            },
          ],
        };
      } else if (roleStr === "CAMPUS_ADMIN") {
        whereClause = {
          userRoles: {
            some: {
              role: "CAMPUS_ADMIN" as Role,
              campusId: campusId as string,
            },
          },
        };
      } else if (roleStr === "SUPER_ADMIN") {
        // SUPER_ADMIN ไม่มี campusId (ข้าม campusId ไปเลย)
        whereClause = {
          userRoles: {
            some: {
              role: "SUPER_ADMIN" as Role,
            },
          },
        };
      }
    } else if (role) {
      // Case: only role provided
      // This logic was already correct.
      const roleStr = role as string;
      if (roleStr === "USER") {
        whereClause = {
          userOrganizations: {
            some: {
              role: "USER" as Role,
            },
          },
        };
      } else if (roleStr === "CAMPUS_ADMIN" || roleStr === "SUPER_ADMIN") {
        whereClause = {
          userRoles: {
            some: {
              role: roleStr as Role,
            },
          },
        };
      }
    } else if (campusId) {
      whereClause = {
        campusId: campusId as string,
      };
    }

    const users: UserWithRelations[] = await prisma.user.findMany({
      where: whereClause,
      include: includeOptions,
    });

    return res.status(200).json({
      message: "Users retrieved successfully",
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Error fetching users by role and campus:", error);
    return res.status(500).json({
      error: "An error occurred while fetching users by role and campus.",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};


export const editInfoUser = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { userId } = req.params;
  const { name, email, phoneNumber, image } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        phoneNumber,
        image,
      },
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
      message: "User information updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user information:", error);
    return res.status(500).json({
      error: "An error occurred while updating user information.",
    });
  }
}

