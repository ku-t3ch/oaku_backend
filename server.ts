import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "./configs/passport";
import { connectDB, checkDBHealth } from "./configs/db";
import authRoutes from "./routes/auth.routes";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS Configuration
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

// Passport middleware
app.use(passport.initialize());

// Health check endpoint
app.get("/health", async (req, res) => {
  const dbHealth = await checkDBHealth();
  res.json({
    status: "Backend server is running",
    port: PORT,
    environment: process.env.NODE_ENV,
    database: dbHealth,
    frontend: FRONTEND_URL,
    timestamp: new Date().toISOString(),
  });
});

// Basic API endpoint
app.get("/api", (req, res) => {
  res.json({
    message: "OAKU Backend API",
    version: "1.0.0",
    environment: process.env.NODE_ENV,
    endpoints: {
      health: "/health",
      auth: "/auth/*",
      users: "/api/users (coming soon)",
      organizations: "/api/organizations (coming soon)",
    },
  });
});

// Auth routes
app.use("/auth", authRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    method: req.method,
    url: req.originalUrl,
  });
});

// Error handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error:", err);
    res.status(500).json({
      error: "Internal server error",
      message:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Something went wrong",
    });
  }
);

// Start server with retry logic
async function startServer() {
  const maxRetries = 10;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      console.log(
        `🔄 Starting server... (attempt ${retries + 1}/${maxRetries})`
      );

      const dbConnected = await connectDB();

      if (!dbConnected) {
        throw new Error("Database connection failed");
      }

      app.listen(PORT, "0.0.0.0", () => {
        console.log(`🚀 Backend server is running on http://localhost:${PORT}`);
        console.log(`🌐 Frontend URL: ${FRONTEND_URL}`);
        console.log(`🔍 Health check: http://localhost:${PORT}/health`);
        console.log(`   Google OAuth: http://localhost:${PORT}/auth/google`);
        console.log(`   Profile: http://localhost:${PORT}/auth/profile`);
      });

      break;
    } catch (error) {
      retries++;
      console.error(`❌ Attempt ${retries} failed:`, error);

      if (retries >= maxRetries) {
        console.error("❌ Max retries reached. Exiting...");
        process.exit(1);
      }

      console.log(`⏳ Waiting 5 seconds before retry...`);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

startServer();

export default app;
