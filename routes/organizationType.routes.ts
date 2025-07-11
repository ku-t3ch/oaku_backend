import { Router } from "express";
import { getOrganizationTypes } from "../controllers/organizationType.controller";
import { authenticateJWT, ALLROLE } from "../middlewares/auth.middleware";

const router = Router();

// GET /organization-types (รองรับ query ?campusId=xxx)
router.get("/", authenticateJWT, ALLROLE, getOrganizationTypes);

export default router;
