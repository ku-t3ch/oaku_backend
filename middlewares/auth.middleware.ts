import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, getUserRole } from "../utils/jwt";
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

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: Token is missing",
        code: "MISSING_TOKEN",
      });
      return;
    }

    const payload = verifyAccessToken(token);

    // Create user object from token payload that matches User interface
    const user: User = {
      id: payload.userId,
      userId: payload.userId,
      name: payload.email.split("@")[0],
      email: payload.email,
      phoneNumber: undefined,
      image: undefined,
      campusId: payload.campusId || "default-campus",
      campus: undefined,
      userOrganizations: [], // Will be populated from database if needed
      isSuspended: false,
      createdAt: new Date(), // Mock for JWT user
      updatedAt: new Date(), // Mock for JWT user
    };
    (user as any).role = payload.role || "USER";

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

// Role-based Authorization Middleware
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

    // 🔧 แก้ไข: ใช้ role จาก JWT token payload
    const userRole = (req.user as any).role || Role.USER;

    console.log("🔍 User role from token:", userRole);
    console.log("🔍 Allowed roles:", allowedRoles);

    // Convert string to Role enum if needed
    const userRoleEnum =
      typeof userRole === "string"
        ? (Role as any)[userRole] || Role.USER
        : userRole;

    if (!allowedRoles.includes(userRoleEnum)) {
      res.status(403).json({
        success: false,
        message: "Access denied: Insufficient permissions",
        code: "INSUFFICIENT_PERMISSIONS",
        data: {
          requiredRoles: allowedRoles,
          userRole: userRoleEnum,
        },
      });
      return;
    }

    next();
  };
};

// Organization-based Authorization
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

    const userRole = getUserRole(req.user) as Role;

    // SUPER_ADMIN และ CAMPUS_ADMIN ใช้ได้ทุก organization
    if ([Role.SUPER_ADMIN, Role.CAMPUS_ADMIN].includes(userRole)) {
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

// Optional Authentication
export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      next(); // ไม่มี token ก็ผ่านไป
      return;
    }

    const token = authHeader.substring(7);

    if (!token) {
      next();
      return;
    }

    // Try to verify token
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
      isSuspended: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    req.user = user;
    next();
  } catch (error) {
    // สำหรับ optional auth ไม่ต้อง throw error
    next();
  }
};

// Campus-based Authorization
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
    const userRole = getUserRole(req.user) as Role;

    // SUPER_ADMIN ใช้ได้ทุก campus
    if (userRole === Role.SUPER_ADMIN) {
      next();
      return;
    }

    // CAMPUS_ADMIN ใช้ได้เฉพาะ campus ของตัวเอง
    if (userRole === Role.CAMPUS_ADMIN) {
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

// Pre-defined role middlewares
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

// Enhanced role checking with organization context
export const requireOrganizationRole = (minRole: Role) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
        code: "AUTH_REQUIRED",
      });
      return;
    }

    const organizationId = req.params.organizationId || req.body.organizationId;

    if (!organizationId) {
      res.status(400).json({
        success: false,
        message: "Organization ID required",
        code: "MISSING_ORG_ID",
      });
      return;
    }

    // Check if user has the required role in this organization
    const userOrgRole = req.user.userOrganizations?.find(
      (uo: any) => uo.organizationId === organizationId
    )?.role;

    const roleHierarchy = [
      Role.USER,
      Role.ADMIN,
      Role.CAMPUS_ADMIN,
      Role.SUPER_ADMIN,
    ];

    const userRole = getUserRole(req.user) as Role;
    const userRoleLevel = roleHierarchy.indexOf(userOrgRole || userRole);
    const minRoleLevel = roleHierarchy.indexOf(minRole);

    if (userRoleLevel < minRoleLevel) {
      res.status(403).json({
        success: false,
        message: "Access denied: Insufficient role in this organization",
        code: "INSUFFICIENT_ORG_ROLE",
        data: {
          requiredRole: minRole,
          userRole: userOrgRole || userRole,
        },
      });
      return;
    }

    next();
  };
};
