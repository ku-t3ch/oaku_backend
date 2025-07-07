import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, getUserRoles, getHighestRole } from "../utils/jwt";
import { Role, User } from "../types/user";

// JWT Authentication Middleware
export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: Authorization header is missing",
        code: "MISSING_AUTH_HEADER",
      });
      return;
    }

    if (!authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message:
          "Unauthorized: Invalid authorization format. Use 'Bearer <token>'",
        code: "INVALID_AUTH_FORMAT",
      });
      return;
    }

    const token = authHeader.substring(7);

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: Token is missing",
        code: "MISSING_TOKEN",
      });
      return;
    }

    const payload = verifyAccessToken(token);

    // ✅ Create user object from token payload with roles
    const user: User = {
      id: payload.userId,
      userId: payload.userId,
      name: payload.email.split("@")[0],
      email: payload.email,
      phoneNumber: undefined,
      image: undefined,
      campusId: payload.campusId || "default-campus",
      campus: undefined,
      userOrganizations: [],
      userRoles: [], // ✅ เพิ่ม userRoles
      isSuspended: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // ✅ เพิ่ม roles จาก JWT payload
    (user as any).roles = payload.roles || ["USER"];
    (user as any).primaryRole = getHighestRole(payload.roles?.map(r => r as Role) || [Role.USER]);

    req.user = user;
    next();
  } catch (error: any) {
    console.error("JWT Authentication Error:", error.message);

    let errorCode = "AUTH_FAILED";
    let statusCode = 401;

    if (error.message.includes("expired")) {
      errorCode = "TOKEN_EXPIRED";
    } else if (error.message.includes("signature")) {
      errorCode = "INVALID_SIGNATURE";
    } else if (error.message.includes("malformed")) {
      errorCode = "MALFORMED_TOKEN";
    }

    res.status(statusCode).json({
      success: false,
      message: "Unauthorized: Invalid or expired token",
      code: errorCode,
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ✅ แก้ไข Role-based Authorization Middleware
export const authorizeRoles = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
        code: "AUTH_REQUIRED",
      });
      return;
    }

    // ✅ ใช้ roles array จาก JWT token
    const userRoles = (req.user as any).roles || ["USER"];

    console.log("🔍 User roles from token:", userRoles);
    console.log("🔍 Allowed roles:", allowedRoles);

    // ✅ ตรวจสอบว่ามี role ใดตรงกับที่อนุญาตหรือไม่
    const hasAllowedRole = userRoles.some((role: string) => 
      allowedRoles.includes(role as Role)
    );

    if (!hasAllowedRole) {
      res.status(403).json({
        success: false,
        message: "Access denied: Insufficient permissions",
        code: "INSUFFICIENT_PERMISSIONS",
        data: {
          requiredRoles: allowedRoles,
          userRoles: userRoles,
        },
      });
      return;
    }

    next();
  };
};

// ✅ ปรับปรุง Organization-based Authorization
export const authorizeOrganization = (organizationId?: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
        code: "AUTH_REQUIRED",
      });
      return;
    }

    const targetOrgId =
      organizationId || req.params.organizationId || req.body.organizationId;

    if (!targetOrgId) {
      res.status(400).json({
        success: false,
        message: "Organization ID required",
        code: "MISSING_ORG_ID",
      });
      return;
    }

    // ✅ ใช้ roles array
    const userRoles = (req.user as any).roles || ["USER"];

    // SUPER_ADMIN และ CAMPUS_ADMIN ใช้ได้ทุก organization
    if (userRoles.includes("SUPER_ADMIN") || userRoles.includes("CAMPUS_ADMIN")) {
      next();
      return;
    }

    // ตรวจสอบว่าผู้ใช้เป็นสมาชิกของ organization นี้หรือไม่
    const isMember = req.user.userOrganizations?.some(
      (uo: any) => uo.organizationId === targetOrgId
    );

    if (!isMember) {
      res.status(403).json({
        success: false,
        message: "Access denied: Not a member of this organization",
        code: "NOT_ORGANIZATION_MEMBER",
      });
      return;
    }

    next();
  };
};

// ✅ อัพเดต Campus-based Authorization
export const authorizeCampus = (campusId?: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
        code: "AUTH_REQUIRED",
      });
      return;
    }

    const targetCampusId = campusId || req.params.campusId || req.body.campusId;
    const userRoles = (req.user as any).roles || ["USER"];

    // SUPER_ADMIN ใช้ได้ทุก campus
    if (userRoles.includes("SUPER_ADMIN")) {
      next();
      return;
    }

    // CAMPUS_ADMIN ใช้ได้เฉพาะ campus ของตัวเอง
    if (userRoles.includes("CAMPUS_ADMIN")) {
      if (req.user.campusId === targetCampusId) {
        next();
        return;
      }
    }

    res.status(403).json({
      success: false,
      message: "Access denied: Insufficient campus permissions",
      code: "INSUFFICIENT_CAMPUS_PERMISSIONS",
    });
  };
};

// Optional Authentication
export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      next();
      return;
    }

    const token = authHeader.substring(7);

    if (!token) {
      next();
      return;
    }

    const payload = verifyAccessToken(token);

    const user: User = {
      id: payload.userId,
      userId: payload.userId,
      name: payload.email.split("@")[0],
      email: payload.email,
      phoneNumber: undefined,
      image: undefined,
      campusId: payload.campusId || "default-campus",
      campus: undefined,
      userOrganizations: [],
      userRoles: [],
      isSuspended: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // ✅ เพิ่ม roles
    (user as any).roles = payload.roles || ["USER"];

    req.user = user;
    next();
  } catch (error) {
    next();
  }
};

// Pre-defined role middlewares - ✅ ใช้ authorizeRoles ที่แก้ไขแล้ว
export const adminOnly = authorizeRoles([
  Role.ADMIN,
  Role.CAMPUS_ADMIN,
  Role.SUPER_ADMIN,
]);
export const superAdminOnly = authorizeRoles([Role.SUPER_ADMIN]);
export const campusAdminOrHigher = authorizeRoles([
  Role.CAMPUS_ADMIN,
  Role.SUPER_ADMIN,
]);
export const userOrHigher = authorizeRoles([
  Role.USER,
  Role.ADMIN,
  Role.CAMPUS_ADMIN,
  Role.SUPER_ADMIN,
]);
