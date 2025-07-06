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
      organizationId,
      role,
      position,
    } = req.body;

    // Validation
    if (!userId || !name || !email || !campusId || !organizationId || !role) {
      return res.status(400).json({
        message: "Missing required fields",
        required: [
          "userId",
          "name",
          "email",
          "campusId",
          "organizationId",
          "role",
        ],
      });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ userId }, { email }],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User ID or email already exists",
        conflictField: existingUser.userId === userId ? "userId" : "email",
      });
    }

    // ✅ ตรวจสอบ campus และ organization พร้อมกัน
    const [campus, organization] = await Promise.all([
      prisma.campus.findUnique({ where: { id: campusId } }),
      prisma.organization.findUnique({
        where: { id: organizationId },
        include: {
          campus: true,
          organizationType: true,
        },
      }),
    ]);

    if (!campus) {
      return res.status(404).json({ message: "Campus not found" });
    }

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // ✅ สร้าง user พร้อม UserOrganization ที่มีข้อมูลครบถ้วน
    const user = await prisma.user.create({
      data: {
        userId,
        name,
        email,
        phoneNumber,
        campusId,
        userOrganizations: {
          create: {
            userIdCode: userId, // ✅ เพิ่ม userIdCode
            organizationIdCode: organization.publicOrganizationId, // ✅ เพิ่ม organizationIdCode
            organization: {
              connect: {
                id: organizationId,
              },
            },
            role: role as Role,
            position: (position as Position) || "NON_POSITION",
          },
        },
      },
      include: {
        campus: true,
        userOrganizations: {
          include: {
            organization: {
              include: {
                campus: true, // ✅ เพิ่ม campus include
                organizationType: true, // ✅ เพิ่ม organizationType include
              },
            },
          },
        },
      },
    });

    // ✅ ส่งข้อมูลที่สอดคล้องกับ auth.controller.ts
    res.status(201).json({
      message: "User created successfully",
      data: {
        user: {
          id: user.id,
          userId: user.userId,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          image: user.image,
          campus: user.campus, // ✅ ส่ง campus object แทน campusId
          userOrganizations: user.userOrganizations.map((uo) => ({
            id: uo.id, // ✅ เพิ่ม id
            userId: uo.userId,
            organizationId: uo.organizationId,
            userIdCode: uo.userIdCode, // ✅ เพิ่ม userIdCode
            organizationIdCode: uo.organizationIdCode, // ✅ เพิ่ม organizationIdCode
            role: uo.role,
            position: uo.position,
            joinedAt: uo.joinedAt,
            organization: {
              id: uo.organization.id,
              publicOrganizationId: uo.organization.publicOrganizationId,
              nameEn: uo.organization.nameEn,
              nameTh: uo.organization.nameTh,
              image: uo.organization.image,
              details: uo.organization.details,
              email: uo.organization.email,
              phoneNumber: uo.organization.phoneNumber,
              campus: uo.organization.campus, // ✅ เพิ่ม campus
              organizationType: uo.organization.organizationType, // ✅ เพิ่ม organizationType
            },
          })),
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);

    // Handle Prisma specific errors
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return res.status(400).json({
          message: "User with this ID or email already exists",
          error: "DUPLICATE_USER",
        });
      }

      if (error.message.includes("Foreign key constraint")) {
        return res.status(400).json({
          message: "Invalid campus or organization ID",
          error: "INVALID_REFERENCE",
        });
      }
    }

    res.status(500).json({
      message: "Failed to create user",
      error:
        process.env.NODE_ENV === "development"
          ? error
          : "Internal server error",
    });
  }
};

// ✅ เพิ่ม function อื่นๆ ที่จำเป็น
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
      },
    });

    res.status(200).json({
      message: "Users retrieved successfully",
      data: { users },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      message: "Failed to fetch users",
      error:
        process.env.NODE_ENV === "development"
          ? error
          : "Internal server error",
    });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

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
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User retrieved successfully",
      data: { user },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      message: "Failed to fetch user",
      error:
        process.env.NODE_ENV === "development"
          ? error
          : "Internal server error",
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, phoneNumber, campusId } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        phoneNumber,
        campusId,
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
      },
    });

    res.status(200).json({
      message: "User updated successfully",
      data: { user },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      message: "Failed to update user",
      error:
        process.env.NODE_ENV === "development"
          ? error
          : "Internal server error",
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id },
    });

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      message: "Failed to delete user",
      error:
        process.env.NODE_ENV === "development"
          ? error
          : "Internal server error",
    });
  }
};
