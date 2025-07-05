import dotenv from "dotenv";

import { generateAccessToken, generateRefreshToken } from "./utils/jwt";

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET is missing from .env file");
  process.exit(1);
}

if (!process.env.JWT_REFRESH_SECRET) {
  console.error("❌ JWT_REFRESH_SECRET is missing from .env file");
  process.exit(1);
}

console.log("✅ Environment variables validated successfully");

const testUsers = [
  {
    userId: "b6610450366",
    email: "rawipon.po@ku.ac.th",
    role: "USER",
    campusId: "campus-ku-bangkhen",
  },
  {
    userId: "admin001",
    email: "admin@ku.ac.th",
    role: "ADMIN",
    campusId: "campus-ku-bangkhen",
  },
  {
    userId: "campus_admin001",
    email: "campus.admin@ku.ac.th",
    role: "CAMPUS_ADMIN",
    campusId: "campus-ku-bangkhen",
  },
  {
    userId: "super_admin001",
    email: "super.admin@ku.ac.th",
    role: "SUPER_ADMIN",
  },
];

try {
  console.log("\n=== 🔑 Test Tokens for Postman ===\n");

  testUsers.forEach((testUser, index) => {
    const accessToken = generateAccessToken(testUser);
    const refreshToken = generateRefreshToken(testUser);

    console.log(`👤 User ${index + 1} (${testUser.role}):`);
    console.log(`   User ID: ${testUser.userId}`);
    console.log(`   Email: ${testUser.email}`);
    console.log(`   Role: ${testUser.role}`);
    if (testUser.campusId) console.log(`   Campus ID: ${testUser.campusId}`);

    console.log(`\n🟢 Access Token (${testUser.role}):`);
    console.log(accessToken);
    console.log(`\n🔄 Refresh Token (${testUser.role}):`);
    console.log(refreshToken);
    console.log("\n" + "=".repeat(80) + "\n");
  });

  console.log("📝 Instructions:");
  console.log("1. เปิด Postman");
  console.log("2. ไปที่ Environments → Create Environment");
  console.log('3. ตั้งชื่อ: "OAKU Local"');
  console.log("4. เพิ่ม Variables:");
  console.log("   - base_url: http://localhost:3001");
  console.log("   - access_token_user: (copy USER token)");
  console.log("   - access_token_admin: (copy ADMIN token)");
  console.log("   - access_token_campus_admin: (copy CAMPUS_ADMIN token)");
  console.log("   - access_token_super_admin: (copy SUPER_ADMIN token)");
  console.log("5. Save และเลือก Environment นี้");
  console.log("========================================\n");
} catch (error) {
  console.error("❌ Error generating tokens:", error);
  process.exit(1);
}
