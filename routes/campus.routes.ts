import { Router } from "express";
import { getAllCampus } from "../controllers/campus.controller";
import {
  authenticateJWT,
  adminOnly,
  superAdminOnly,
  headOrAdminOnly,
  ALLROLE,
} from "../middlewares/auth.middleware";

const router = Router();

// GET /campus
router.get("/", authenticateJWT, ALLROLE, getAllCampus);

export default router;

