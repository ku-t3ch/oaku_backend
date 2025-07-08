import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../configs/db";
import { Role, User } from "@prisma/client";
import { verifyAccessToken } from "../utils/jwt";

interface AuthenticatedRequest extends Request {
  user?: any;
}

// JWT Authentication Middleware
export const authenticateJWT = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // ดึงข้อมูล user จาก database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        campus: true,
        userRoles: {
          include: {
            campus: true,
          },
        },
        userOrganizations: {
          include: {
            organization: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    if (user.isSuspended) {
      return res.status(403).json({ error: "Account is suspended" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT Authentication error:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
};

// ✅ ปรับปรุง requireSuperAdmin ให้ใช้ userRoles จาก database
export const requireSuperAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({
      error: "Authentication required",
    });
  }

  const isSuperAdmin = user.userRoles?.some((role: any) => role.role === "SUPER_ADMIN");

  if (!isSuperAdmin) {
    return res.status(403).json({
      error: "Access denied. Super admin role required.",
    });
  }

  next();
};

// ✅ ปรับปรุง requireCampusAdmin ให้ใช้ userRoles จาก database
export const requireCampusAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({
      error: "Authentication required",
    });
  }

  const isAdmin = user.userRoles?.some(
    (role: any) => role.role === "CAMPUS_ADMIN" || role.role === "SUPER_ADMIN"
  );

  if (!isAdmin) {
    return res.status(403).json({
      error: "Access denied. Admin role required.",
    });
  }

  next();
};

// ✅ สร้าง middleware ใหม่สำหรับ role-based authorization
export const requireRoles = (allowedRoles: Role[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    const userRoles = user.userRoles?.map((ur: any) => ur.role) || [];
    const hasRequiredRole = userRoles.some((role: Role) => allowedRoles.includes(role));

    if (!hasRequiredRole) {
      return res.status(403).json({
        error: "Access denied. Insufficient permissions.",
        requiredRoles: allowedRoles,
        userRoles: userRoles,
      });
    }

    next();
  };
};

// ✅ Optional Authentication (ไม่บังคับ login)
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      next(); // ไม่มี token ก็ผ่านไป
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        campus: true,
        userRoles: {
          include: {
            campus: true,
          },
        },
        userOrganizations: {
          include: {
            organization: true,
          },
        },
      },
    });

    if (user && !user.isSuspended) {
      req.user = user;
    }

    next();
  } catch (error) {
    // Token ไม่ถูกต้องก็ผ่านไปโดยไม่มี user
    next();
  }
};

// ✅ Campus-based Authorization
export const requireCampusAccess = (campusId?: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    const targetCampusId = campusId || req.params.campusId || req.body.campusId;

    // SUPER_ADMIN ใช้ได้ทุก campus
    const isSuperAdmin = user.userRoles?.some((role: any) => role.role === "SUPER_ADMIN");

    if (isSuperAdmin) {
      next();
      return;
    }

    // CAMPUS_ADMIN ใช้ได้เฉพาะ campus ที่ตัวเองดูแล
    const isCampusAdmin = user.userRoles?.some(
      (role: any) => role.role === "CAMPUS_ADMIN" && role.campusId === targetCampusId
    );

    if (isCampusAdmin) {
      next();
      return;
    }

    // User ธรรมดาใช้ได้เฉพาะ campus ของตัวเอง
    if (user.campusId === targetCampusId) {
      next();
      return;
    }

    return res.status(403).json({
      error: "Access denied. Insufficient campus permissions",
    });
  };
};

// ✅ Organization-based Authorization
export const requireOrganizationAccess = (organizationId?: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    const targetOrgId = organizationId || req.params.organizationId || req.body.organizationId;

    // SUPER_ADMIN และ CAMPUS_ADMIN ใช้ได้ทุก organization
    const isAdmin = user.userRoles?.some((role: any) => role.role === "SUPER_ADMIN" || role.role === "CAMPUS_ADMIN");

    if (isAdmin) {
      next();
      return;
    }

    // ตรวจสอบว่าเป็นสมาชิกของ organization นี้หรือไม่
    const isMember = user.userOrganizations?.some((uo: any) => uo.organizationId === targetOrgId);

    if (!isMember) {
      return res.status(403).json({
        error: "Access denied. Not a member of this organization",
      });
    }

    next();
  };
};

// ✅ Pre-defined role middlewares
export const adminOnly = requireRoles([Role.CAMPUS_ADMIN, Role.SUPER_ADMIN]);
export const superAdminOnly = requireRoles([Role.SUPER_ADMIN]);
export const userOrHigher = requireRoles([Role.USER, Role.CAMPUS_ADMIN, Role.SUPER_ADMIN]);

// Legacy middlewares (เก็บไว้เพื่อ backward compatibility)
export const authorizeRoles = requireRoles;
export const authorizeCampus = requireCampusAccess;
export const authorizeOrganization = requireOrganizationAccess;
