import { Request, Response } from "express";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  getUserRoles,
  getHighestRole,
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
        userRoles: { 
          include: {
            campus: true,
          },
        },
      },
    });

    if (!fullUser) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/Login?error=user_not_found`
      );
    }

    const userRoles = getUserRoles(fullUser);
    const highestRole = getHighestRole(userRoles);

    const accessToken = generateAccessToken({
      userId: fullUser.id,
      email: fullUser.email,
      roles: userRoles.map(role => role.toString()),
      campusId: fullUser.campusId,
    });

    const refreshToken = generateRefreshToken({
      userId: fullUser.id,
      email: fullUser.email,
      roles: userRoles.map(role => role.toString()),
      campusId: fullUser.campusId,
    });


    const userData = {
      id: fullUser.id,
      userId: fullUser.userId,
      name: fullUser.name,
      email: fullUser.email,
      image: fullUser.image, 
      roles: userRoles,
      primaryRole: highestRole, 
      campusId: fullUser.campusId,
      campus: fullUser.campus,
      userOrganizations: fullUser.userOrganizations?.map((uo) => ({
        id: uo.id,
        userId: uo.userId,
        organizationId: uo.organizationId,
        userIdCode: uo.userIdCode,
        publicOrganizationId: uo.publicOrganizationId,
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
      userRoles: fullUser.userRoles?.map((ur) => ({ // ✅ เพิ่ม userRoles
        id: ur.id,
        userId: ur.userId,
        role: ur.role,
        campusId: ur.campusId,
        createdAt: ur.createdAt,
        campus: ur.campus,
      })) || [],
    };

    console.log("🔍 Sending user data:", JSON.stringify(userData, null, 2));

    // Log การเข้าสู่ระบบ
    await prisma.log.create({
      data: {
        action: "USER_LOGIN",
        message: `User ${fullUser.email} logged in successfully with roles: ${userRoles.join(', ')}`,
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

    // ✅ Include userRoles ใน query
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
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
        userRoles: { // ✅ เพิ่ม userRoles
          include: {
            campus: true,
          },
        },
      },
    });

    if (!user || user.isSuspended) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // ✅ ใช้ getUserRoles
    const userRoles = getUserRoles(user);
    const highestRole = getHighestRole(userRoles);

    // ✅ สร้าง access token ใหม่ด้วย roles array
    const newAccessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      roles: userRoles.map(role => role.toString()),
      campusId: user.campusId,
    });

    res.json({
      accessToken: newAccessToken,
      user: {
        id: user.id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        roles: userRoles,
        primaryRole: highestRole,
        campus: user.campus ,
        userOrganizations: user.userOrganizations,
        userRoles: user.userRoles,
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

    // ✅ ใช้ getUserRoles
    const userRoles = getUserRoles(user);
    const highestRole = getHighestRole(userRoles);

    res.json({
      user: {
        id: user.id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        image: user.image,
        roles: userRoles, // ✅ ส่ง array ของ roles
        primaryRole: highestRole, // ✅ ส่ง primary role
        campus: user.campus,
        userOrganizations: user.userOrganizations?.map((uo: any) => ({
          id: uo.id,
          organization: uo.organization,
          role: uo.role,
          position: uo.position,
          joinedAt: uo.joinedAt,
        })),
        userRoles: user.userRoles?.map((ur: any) => ({ // ✅ เพิ่ม userRoles
          id: ur.id,
          role: ur.role,
          campusId: ur.campusId,
          campus: ur.campus,
          createdAt: ur.createdAt,
        })),
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Failed to get profile" });
  }
};
