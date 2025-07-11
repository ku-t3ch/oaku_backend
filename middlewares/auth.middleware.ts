import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../configs/db";
import { Role } from "@prisma/client";

// ---------- Types ----------
export interface AuthenticatedRequest extends Request {
  user?: any;
}

// ---------- JWT Authentication ----------
export const authenticateJWT = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Access token required" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        campus: true,
        userRoles: { include: { campus: true } },
        userOrganizations: { include: { organization: true } },
      },
    });

    if (!user) return res.status(401).json({ error: "Invalid token" });
    if (user.isSuspended)
      return res.status(403).json({ error: "Account is suspended" });

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT Authentication error:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
};

// ---------- Role-based Middleware ----------
export const requireRoles =
  (allowedRoles: Role[]) =>
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user)
      return res.status(401).json({ error: "Authentication required" });

    const userRoles = user.userRoles?.map((ur: any) => ur.role) || [];
    const hasRequiredRole = userRoles.some((role: Role) =>
      allowedRoles.includes(role)
    );
    if (!hasRequiredRole) {
      return res.status(403).json({
        error: "Access denied. Insufficient permissions.",
        requiredRoles: allowedRoles,
        userRoles,
      });
    }
    next();
  };

export const adminOnly = requireRoles([Role.CAMPUS_ADMIN, Role.SUPER_ADMIN]);
export const superAdminOnly = requireRoles([Role.SUPER_ADMIN]);
export const userOrHigher = requireRoles([
  Role.USER,
  Role.CAMPUS_ADMIN,
  Role.SUPER_ADMIN,
]);

// ---------- Optional Auth Middleware ----------
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return next();

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        campus: true,
        userRoles: { include: { campus: true } },
        userOrganizations: { include: { organization: true } },
      },
    });

    if (user && !user.isSuspended) req.user = user;
    next();
  } catch {
    next();
  }
};

// ---------- Campus Access Middleware ----------
export const requireCampusAccess =
  (campusId?: string) =>
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user)
      return res.status(401).json({ error: "Authentication required" });

    const targetCampusId = campusId || req.params.campusId || req.body.campusId;
    const isSuperAdmin = user.userRoles?.some(
      (role: any) => role.role === "SUPER_ADMIN"
    );
    const isCampusAdmin = user.userRoles?.some(
      (role: any) =>
        role.role === "CAMPUS_ADMIN" && role.campusId === targetCampusId
    );
    const isSameCampus = user.campusId === targetCampusId;

    if (isSuperAdmin || isCampusAdmin || isSameCampus) return next();

    return res
      .status(403)
      .json({ error: "Access denied. Insufficient campus permissions" });
  };

// ---------- Organization Access Middleware ----------
export const requireOrganizationAccess =
  (organizationId?: string) =>
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user)
      return res.status(401).json({ error: "Authentication required" });

    const targetOrgId =
      organizationId || req.params.organizationId || req.body.organizationId;
    const isAdmin = user.userRoles?.some(
      (role: any) => role.role === "SUPER_ADMIN" || role.role === "CAMPUS_ADMIN"
    );
    const isMember = user.userOrganizations?.some(
      (uo: any) => uo.organizationId === targetOrgId
    );

    if (isAdmin || isMember) return next();

    return res
      .status(403)
      .json({ error: "Access denied. Not a member of this organization" });
  };

// ---------- SUPER_ADMIN > CAMPUS_ADMIN > USER-HEAD Middleware ----------
export const headOrAdminOnly = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const isSuperAdmin = user?.userRoles?.some(
    (ur: any) => ur.role === "SUPER_ADMIN"
  );
  const isCampusAdmin = user?.userRoles?.some(
    (ur: any) => ur.role === "CAMPUS_ADMIN"
  );
  const isHead = user?.userOrganizations?.some(
    (uo: any) => uo.position === "HEAD"
  );

  if (isSuperAdmin || isCampusAdmin || isHead) return next();

  return res.status(403).json({
    error:
      "Access denied. Only SUPER_ADMIN, CAMPUS_ADMIN, or USER-HEAD allowed.",
  });
};

// ---------- SUPER_ADMIN > CAMPUS_ADMIN > USER-HEAD > USER-MEMBER Middleware ----------
export const ALLROLE = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const isSuperAdmin = user?.userRoles?.some((ur: any) => ur.role === "SUPER_ADMIN");
  const isCampusAdmin = user?.userRoles?.some((ur: any) => ur.role === "CAMPUS_ADMIN");
  const isHead = user?.userOrganizations?.some((uo: any) => uo.position === "HEAD");
  const isMember = user?.userOrganizations?.some((uo: any) => uo.position === "MEMBER");

  if (isSuperAdmin || isCampusAdmin || isHead || isMember) return next();

  return res.status(403).json({
    error: "Access denied. Only SUPER_ADMIN, CAMPUS_ADMIN, USER-HEAD, or USER-MEMBER allowed.",
  });
};

// ---------- Export Aliases ----------
export const authorizeRoles = requireRoles;
export const authorizeCampus = requireCampusAccess;
export const authorizeOrganization = requireOrganizationAccess;
