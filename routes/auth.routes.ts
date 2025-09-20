import { Router, Request, Response } from "express";
import passport from "passport";
import {
  googleCallback,
  refreshToken as refreshTokenController,
  logout,
  getProfile,
} from "../controllers/auth.controller";
import { ALLROLE, authenticateJWT } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json({
    message: "OAKU Authentication API",
    version: "1.0.0",
    environment: process.env.NODE_ENV,
    server: {
      status: "running",
      timestamp: new Date().toISOString(),
    },
    availableRoutes: {
      public: [
        "GET /auth/ - This API info",
        "GET /auth/google - Google OAuth login",
        "GET /auth/google/callback - OAuth callback",
        "GET /auth/kuall - KUALL OAuth login",
        "GET /auth/kuall/callback - KUALL OAuth callback",
      ],
      protected: [
        "GET /auth/test - Test protected route (any authenticated user)",
        "GET /auth/profile - Get user profile (any authenticated user)",
        "POST /auth/logout - Logout user (any authenticated user)",
      ],
    },
    howToTest: {
      step1: "Generate tokens: npx tsx generate-test-token.ts",
      step2: "Copy tokens to Postman environment",
      step3: "Test with header: Authorization: Bearer <token>",
      step4: "Check token status with POST /auth/debug-token",
    },
    tokenInfo: {
      accessTokenExpiry: process.env.JWT_EXPIRES_IN || "7d",
      refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
    },
  });
});

// GET /auth/google body: {}
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// GET /auth/google/callback body: {}
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleCallback
);

// KU ALL LOGIN
router.get(
  "/kualllogin",
  passport.authenticate("kualllogin", { scope: ["openid", "profile", "email"] })
);

router.get(
  "/kualllogin/callback",
  passport.authenticate("kualllogin", { session: false }),
  googleCallback // ใช้ controller เดียวกับ google ได้เลย
);

router.post(
  "/refresh",
  refreshTokenController as (req: Request, res: Response) => void
);
router.post("/logout", authenticateJWT, ALLROLE, logout);
router.get("/profile", authenticateJWT, ALLROLE, getProfile);

export default router;
