import jwt, { SignOptions } from "jsonwebtoken";
import { Role } from "@prisma/client";

export interface JWTPayload {
  userId: string;
  email: string;
  roles?: string[];
  campusId?: string;
  iat?: number;
  exp?: number;
}

const getJWTSecrets = () => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
  if (!JWT_SECRET) throw new Error("❌ JWT_SECRET is not defined in environment variables");
  if (!JWT_REFRESH_SECRET) throw new Error("❌ JWT_REFRESH_SECRET is not defined in environment variables");
  return { JWT_SECRET, JWT_REFRESH_SECRET };
};

const cleanPayload = (payload: JWTPayload) =>
  Object.fromEntries(Object.entries(payload).filter(([_, v]) => v !== undefined));

export const generateAccessToken = (payload: JWTPayload): string => {
  const { JWT_SECRET } = getJWTSecrets();
  return jwt.sign(cleanPayload(payload), JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

export const generateRefreshToken = (payload: JWTPayload): string => {
  const { JWT_REFRESH_SECRET } = getJWTSecrets();
  return jwt.sign(cleanPayload(payload), JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  });
};

export const verifyAccessToken = (token: string): JWTPayload => {
  const { JWT_SECRET } = getJWTSecrets();
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    if (!decoded.userId || !decoded.email) throw new Error("Invalid token payload: missing required fields");
    return decoded;
  } catch (error: any) {
    if (error.name === "TokenExpiredError") throw new Error("Token has expired");
    if (error.name === "JsonWebTokenError") throw new Error("Invalid token signature");
    if (error.name === "NotBeforeError") throw new Error("Token not active yet");
    throw new Error(`Token verification failed: ${error.message}`);
  }
};

export const verifyRefreshToken = (token: string): JWTPayload => {
  const { JWT_REFRESH_SECRET } = getJWTSecrets();
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload;
    if (!decoded.userId || !decoded.email) throw new Error("Invalid refresh token payload");
    return decoded;
  } catch (error: any) {
    if (error.name === "TokenExpiredError") throw new Error("Refresh token has expired");
    if (error.name === "JsonWebTokenError") throw new Error("Invalid refresh token signature");
    throw new Error(`Refresh token verification failed: ${error.message}`);
  }
};

export const getUserRoles = (user: any): Role[] => {
  const roles: Role[] = [];
  if (user.userOrganizations?.some((uo: any) => uo.role === Role.USER)) roles.push(Role.USER);
  if (user.userRoles?.some((ur: any) => ur.role === Role.SUPER_ADMIN)) roles.push(Role.SUPER_ADMIN);
  if (user.userRoles?.some((ur: any) => ur.role === Role.CAMPUS_ADMIN)) roles.push(Role.CAMPUS_ADMIN);
  return roles.length > 0 ? roles : [Role.USER];
};

export const getHighestRole = (roles: Role[]): Role => {
  const roleHierarchy = [Role.USER, Role.CAMPUS_ADMIN, Role.SUPER_ADMIN];
  return roles.reduce(
    (highest, role) =>
      roleHierarchy.indexOf(role) > roleHierarchy.indexOf(highest) ? role : highest,
    Role.USER
  );
};

export const getUserRole = (user: any): Role => getHighestRole(getUserRoles(user));

export const decodeToken = (token: string): any => {
  try {
    return jwt.decode(token);
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const decoded = jwt.decode(token) as any;
  if (!decoded?.exp) return true;
  return decoded.exp < Math.floor(Date.now() / 1000);
};

export const getTokenExpirationTime = (token: string): Date | null => {
  const decoded = jwt.decode(token) as any;
  return decoded?.exp ? new Date(decoded.exp * 1000) : null;
};

export const getTokenIssuedTime = (token: string): Date | null => {
  const decoded = jwt.decode(token) as any;
  return decoded?.iat ? new Date(decoded.iat * 1000) : null;
};