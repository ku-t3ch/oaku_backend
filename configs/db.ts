import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

declare global {
  var __db: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({
    log: ["error", "warn"],
    errorFormat: "minimal", 
  });
} else {
  if (!global.__db) {
    global.__db = new PrismaClient({
      log: ["query", "error", "warn", "info"],
      errorFormat: "pretty", 
    });
  }
  prisma = global.__db;
}

// Connection test function
export async function connectDB() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
}

// Graceful disconnect function
export async function disconnectDB() {
  try {
    await prisma.$disconnect();
    console.log("🔌 Database disconnected");
  } catch (error) {
    console.error("❌ Error disconnecting from database:", error);
  }
}

// Health check function
export async function checkDBHealth() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: "healthy", timestamp: new Date().toISOString() };
  } catch (error) {
    console.error("Database health check failed:", error);
    return {
      status: "unhealthy",
      error: process.env.NODE_ENV === "development" ? error : "Database error", // ซ่อน error ใน production
      timestamp: new Date().toISOString(),
    };
  }
}

// Export the Prisma instance
export { prisma };
export default prisma;
