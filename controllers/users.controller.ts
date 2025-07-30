import { prisma } from "../configs/db";
import { transformUser } from "../utils/transform";
import { Request, Response } from "express";

export const getUsers = async (req: Request, res: Response) => {
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
    res.status(200).json(users.map(transformUser));
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getUsersByRoleOrCampusIdOrOrganizationTypeIdOrOrganizationId =
  async (req: Request, res: Response) => {
    const { role, campusId, organizationTypeId, organizationId, position } = req.query;

    try {
      // Base where clause
      let whereClause: any = {};

      // Campus filter - applies to all users regardless of role
      if (campusId) {
        whereClause.campusId = campusId as string;
      }

      // Role-based filtering
      if (role === "SUPER_ADMIN" || role === "CAMPUS_ADMIN") {
        // For admin roles, filter by userRoles
        whereClause.userRoles = {
          some: { role: role as string }
        };
      } else if (role === "USER") {
        // For organization users, we need users who have userOrganizations
        // but we'll apply additional filters below
        whereClause.userOrganizations = {
          some: {
            role: "USER", // In userOrganizations, the role is "USER"
          }
        };
      }

      // Additional filters for userOrganizations (applies when filtering by org-related fields)
      // These can apply even without specifying role=ORGANIZATION_USER
      const orgFilters: any = {};
      
      if (position) {
        orgFilters.position = position as string;
      }
      
      if (organizationTypeId) {
        orgFilters.organization = {
          organizationTypeId: organizationTypeId as string
        };
      }
      
      if (organizationId) {
        orgFilters.organizationId = organizationId as string;
      }

      // If we have org-related filters, we need to apply them
      if (Object.keys(orgFilters).length > 0) {
        if (whereClause.userOrganizations) {
          // If we already have userOrganizations filter (from role=ORGANIZATION_USER)
          // merge the additional filters
          whereClause.userOrganizations.some = {
            ...whereClause.userOrganizations.some,
            ...orgFilters
          };
        } else {
          // If we don't have userOrganizations filter yet, create it
          // This handles cases where we filter by org fields without specifying role
          whereClause.userOrganizations = {
            some: {
              role: "USER", // Still need to specify role in userOrganizations
              ...orgFilters
            }
          };
        }
      }

      // Handle campus filter for userOrganizations when needed
      if (campusId && whereClause.userOrganizations) {
        // If we're filtering userOrganizations and campus, 
        // we need to ensure the organization belongs to the specified campus
        if (whereClause.userOrganizations.some.organization) {
          whereClause.userOrganizations.some.organization.campusId = campusId as string;
        } else {
          whereClause.userOrganizations.some.organization = {
            campusId: campusId as string
          };
        }
      }

      console.log('Filter WHERE clause:', JSON.stringify(whereClause, null, 2));

      const users = await prisma.user.findMany({
        where: whereClause,
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

      res.status(200).json(users.map(transformUser));
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
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

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(transformUser(user));
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const editInfoUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, phoneNumber, image } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
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

    res.status(200).json(transformUser(updatedUser));
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const AddOrRemoveCampusAdmin = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role, campusId } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        userRoles: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingRole = user.userRoles.find(
      (ur) => ur.role === role && ur.campusId === campusId
    );

    if (existingRole) {
      await prisma.userRole.delete({
        where: { id: existingRole.id },
      });
      return res.status(200).json({ message: "Role removed successfully" });
    } else {
      await prisma.userRole.create({
        data: {
          userId: user.id,
          role,
          campusId,
        },
      });
      return res.status(201).json({ message: "Role added successfully" });
    }
  } catch (error) {
    console.error("Error adding/removing user role:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const AddSuperAdmin = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        userRoles: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingRole = user.userRoles.find((ur) => ur.role === "SUPER_ADMIN");

    if (existingRole) {
      return res.status(400).json({ error: "User is already a SUPER_ADMIN" });
    }

    await prisma.userRole.create({
      data: {
        userId: user.id,
        role: "SUPER_ADMIN",
      },
    });

    res.status(201).json({ message: "User added as SUPER_ADMIN successfully" });
  } catch (error) {
    console.error("Error adding SUPER_ADMIN:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const AddUserToOrganizationTypeAndOrganization = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const { organizationId, role = "USER", position } = req.body;

  const validPosition = position === "HEAD" ? "HEAD" : "MEMBER";

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        userOrganizations: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingOrganization = user.userOrganizations.find(
      (uo) => uo.organizationId === organizationId
    );

    if (existingOrganization) {
      return res
        .status(400)
        .json({ error: "User already has this organization" });
    }

    await prisma.userOrganization.create({
      data: {
        userId: user.id,
        organizationId,
        userIdCode: user.userId,
        publicOrganizationId: organizationId,
        role,
        position: validPosition,
      },
    });

    res.status(201).json({ message: "Organization added successfully" });
  } catch (error) {
    console.error("Error adding organization:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const SuperAdminSuspendUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isSuspended = true } = req.body; // รับค่าจาก body, default true

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        userRoles: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // เช็คว่ามี role SUPER_ADMIN หรือไม่
    const isSuperAdmin = user.userRoles.some(
      (role) => role.role === "SUPER_ADMIN"
    );
    if (isSuperAdmin) {
      return res.status(403).json({ error: "Cannot suspend SUPER_ADMIN" });
    }

    await prisma.user.update({
      where: { id },
      data: { isSuspended },
    });

    res.status(200).json({
      message: isSuspended
        ? "User suspended successfully"
        : "User unsuspended successfully",
    });
  } catch (error) {
    console.error("Error suspending user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const CampusAdminSuspendUser = async (req: Request, res: Response) => {
  const { id, organizationId } = req.params;
  let { isSuspended = true } = req.body;

  if (typeof isSuspended === "string") {
    isSuspended = isSuspended === "true";
  }

  try {
    // หา userOrganization ที่ตรงกับ user และ organization
    const userOrg = await prisma.userOrganization.findUnique({
      where: {
        userId_organizationId: {
          userId: id,
          organizationId: organizationId,
        },
      },
    });

    if (!userOrg) {
      return res.status(404).json({ error: "UserOrganization not found" });
    }

    await prisma.userOrganization.update({
      where: {
        userId_organizationId: {
          userId: id,
          organizationId: organizationId,
        },
      },
      data: { isSuspended },
    });

    res.status(200).json({
      message: isSuspended
        ? "User suspended in organization successfully"
        : "User unsuspended in organization successfully",
      userOrganization: { userId: id, organizationId, isSuspended },
    });
  } catch (error) {
    console.error("Error suspending user in organization:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
