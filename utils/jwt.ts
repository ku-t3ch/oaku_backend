import jwt, { SignOptions } from "jsonwebtoken";
import { Role } from "../types/user";

export interface JWTPayload {
  userId: string;
  email: string;
  role?: string;
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

export const getUserRole = (user: any): Role => {
  // ตรวจสอบ role สูงสุดจาก userOrganizations
  if (user.userOrganizations && user.userOrganizations.length > 0) {
    const roles = user.userOrganizations.map((uo: any) => uo.role);

    if (roles.includes(Role.SUPER_ADMIN)) return Role.SUPER_ADMIN;
    if (roles.includes(Role.CAMPUS_ADMIN)) return Role.CAMPUS_ADMIN;
    if (roles.includes(Role.ADMIN)) return Role.ADMIN;
  }

  // Fallback to default role
  return Role.USER;
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
