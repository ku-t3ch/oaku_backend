import { Request, Response } from "express";
import { prisma } from "../configs/db"; // ใช้ singleton instance
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

    const [campus, organization] = await Promise.all([
      prisma.campus.findUnique({ where: { id: campusId } }),
      prisma.organization.findUnique({ where: { id: organizationId } }),
    ]);
    if (!campus) {
      return res.status(404).json({ message: "Campus not found" });
    }

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    const user = await prisma.user.create({
      data: {
        userId,
        name,
        email,
        phoneNumber,
        campusId,
        userOrganizations: {
          create: {
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
            organization: true,
          },
        },
      },
    });
    res.status(201).json({
      message: "User created successfully",
      data: {
        user: {
          id: user.id,
          userId: user.userId,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          campus: user.campus,
          organizations: user.userOrganizations.map((uo) => ({
            organization: uo.organization,
            role: uo.role,
            position: uo.position,
            joinedAt: uo.joinedAt,
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


