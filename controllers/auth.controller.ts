import { Request, Response } from "express";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  getUserRole,
} from "../utils/jwt";
import { prisma } from "../configs/db";

export const googleCallback = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;

    if (!user) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/Login?error=auth_failed`
      );
    }


    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
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

    if (!fullUser) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/Login?error=user_not_found`
      );
    }

    const userRole = getUserRole(fullUser);

    // สร้าง JWT tokens
    const accessToken = generateAccessToken({
      userId: fullUser.id,
      email: fullUser.email,
      role: userRole,
    });

    const refreshToken = generateRefreshToken({
      userId: fullUser.id,
      email: fullUser.email,
      role: userRole,
    });


    const userData = {
      id: fullUser.id,
      name: fullUser.name,
      email: fullUser.email,
      image: fullUser.image, 
      role: userRole,
      campus: fullUser.campus, 
      userOrganizations: fullUser.userOrganizations?.map((uo) => ({
        id: uo.id,
        userId: uo.userId,
        organizationId: uo.organizationId,
        userIdCode: uo.userIdCode,
        organizationIdCode: uo.organizationIdCode,
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
          campus: uo.organization.campus, 
          organizationType: uo.organization.organizationType, 
        },
      })) || [],
    };

    console.log("🔍 Sending user data:", JSON.stringify(userData, null, 2));

    // Log การเข้าสู่ระบบ
    await prisma.log.create({
      data: {
        action: "USER_LOGIN",
        message: `User ${fullUser.email} logged in successfully`,
        userId: fullUser.id,
      },
    });

    // Redirect กลับไปที่ frontend
    const userDataEncoded = encodeURIComponent(JSON.stringify(userData));
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/callback?token=${accessToken}&refresh=${refreshToken}&user=${userDataEncoded}`
    );
  } catch (error) {
    console.error("Google callback error:", error);
    res.redirect(`${process.env.FRONTEND_URL}/Login?error=server_error`);
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token required" });
    }

    const payload = verifyRefreshToken(refreshToken);

    // ตรวจสอบว่าผู้ใช้ยังมีอยู่และไม่ถูกระงับ
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        campus: true,
        userOrganizations: {
          include: {
            organization: {
              include: {
                organizationType: true,
              },
            },
          },
        },
      },
    });

    if (!user || user.isSuspended) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const userRole = getUserRole(user);

    // สร้าง access token ใหม่
    const newAccessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: userRole,
    });

    res.json({
      accessToken: newAccessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: userRole,
        campus: user.campus,
      },
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;

    if (user) {
      // Log การออกจากระบบ
      await prisma.log.create({
        data: {
          action: "LOGOUT",
          message: `User ${user.name} logged out`,
          userId: user.id,
        },
      });
    }

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Logout failed" });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;

    const userRole = getUserRole(user);

    res.json({
      user: {
        id: user.id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        image: user.image,
        role: userRole,
        campus: user.campus,
        organizations: user.userOrganizations?.map((uo: any) => ({
          organization: uo.organization,
          role: uo.role,
          position: uo.position,
          joinedAt: uo.joinedAt,
        })),
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Failed to get profile" });
  }
};
