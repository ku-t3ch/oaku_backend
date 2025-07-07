import jwt, { SignOptions } from "jsonwebtoken";
import { Role } from "../types/user";

export interface JWTPayload {
  userId: string;
  email: string;
  roles?: string[]; // ✅ เปลี่ยนจาก role เดี่ยว เป็น roles หลายตัว
  campusId?: string;
  iat?: number;
  exp?: number;
}

// Helper function to get and validate JWT secrets
const getJWTSecrets = () => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

  if (!JWT_SECRET) {
    throw new Error("❌ JWT_SECRET is not defined in environment variables");
  }

  if (!JWT_REFRESH_SECRET) {
    throw new Error(
      "❌ JWT_REFRESH_SECRET is not defined in environment variables"
    );
  }

  return { JWT_SECRET, JWT_REFRESH_SECRET };
};

export const generateAccessToken = (payload: JWTPayload): string => {
  const { JWT_SECRET } = getJWTSecrets();

  // Clean payload - remove undefined values
  const cleanPayload = Object.fromEntries(
    Object.entries(payload).filter(([_, value]) => value !== undefined)
  );

  return jwt.sign(cleanPayload, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

export const generateRefreshToken = (payload: JWTPayload): string => {
  const { JWT_REFRESH_SECRET } = getJWTSecrets();

  // Clean payload
  const cleanPayload = Object.fromEntries(
    Object.entries(payload).filter(([_, value]) => value !== undefined)
  );

  return jwt.sign(cleanPayload, JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  });
};

export const verifyAccessToken = (token: string): JWTPayload => {
  try {
    const { JWT_SECRET } = getJWTSecrets();
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

    if (!decoded.userId || !decoded.email) {
      throw new Error("Invalid token payload: missing required fields");
    }

    return decoded;
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Token has expired");
    } else if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid token signature");
    } else if (error.name === "NotBeforeError") {
      throw new Error("Token not active yet");
    }
    throw new Error(`Token verification failed: ${error.message}`);
  }
};

export const verifyRefreshToken = (token: string): JWTPayload => {
  try {
    const { JWT_REFRESH_SECRET } = getJWTSecrets();
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload;

    if (!decoded.userId || !decoded.email) {
      throw new Error("Invalid refresh token payload");
    }

    return decoded;
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Refresh token has expired");
    } else if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid refresh token signature");
    }
    throw new Error(`Refresh token verification failed: ${error.message}`);
  }
};

// ✅ แก้ไข getUserRoles ให้ส่งคืน array ของ roles
export const getUserRoles = (user: any): Role[] => {
  const roles: Role[] = [];

  // ✅ ตรวจสอบ userOrganizations สำหรับ USER roles
  if (user.userOrganizations && user.userOrganizations.length > 0) {
    const orgRoles = user.userOrganizations.map((uo: any) => uo.role);
    
    // เพิ่มเฉพาะ USER role จาก organizations
    if (orgRoles.includes(Role.USER)) {
      roles.push(Role.USER);
    }
  }

  // ✅ ตรวจสอบ userRoles สำหรับ ADMIN roles (จะเพิ่มใน schema ใหม่)
  if (user.userRoles && user.userRoles.length > 0) {
    const adminRoles = user.userRoles.map((ur: any) => ur.role);
    
    if (adminRoles.includes(Role.SUPER_ADMIN)) roles.push(Role.SUPER_ADMIN);
    if (adminRoles.includes(Role.CAMPUS_ADMIN)) roles.push(Role.CAMPUS_ADMIN);
  }

  // ✅ ถ้าไม่มี role ใดๆ ให้เป็น USER
  return roles.length > 0 ? roles : [Role.USER];
};

// ✅ เพิ่ม function สำหรับหา highest role
export const getHighestRole = (roles: Role[]): Role => {
  const roleHierarchy = [Role.USER, Role.CAMPUS_ADMIN, Role.SUPER_ADMIN];
  
  let highestRole = Role.USER;
  for (const role of roles) {
    if (roleHierarchy.indexOf(role) > roleHierarchy.indexOf(highestRole)) {
      highestRole = role;
    }
  }
  
  return highestRole;
};

// ✅ Backward compatibility function
export const getUserRole = (user: any): Role => {
  const roles = getUserRoles(user);
  return getHighestRole(roles);
};

// Utility functions
export const decodeToken = (token: string): any => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwt.decode(token) as any;
    if (!decoded || !decoded.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

export const getTokenExpirationTime = (token: string): Date | null => {
  try {
    const decoded = jwt.decode(token) as any;
    if (!decoded || !decoded.exp) return null;

    return new Date(decoded.exp * 1000);
  } catch (error) {
    return null;
  }
};

export const getTokenIssuedTime = (token: string): Date | null => {
  try {
    const decoded = jwt.decode(token) as any;
    if (!decoded || !decoded.iat) return null;

    return new Date(decoded.iat * 1000);
  } catch (error) {
    return null;
  }
};