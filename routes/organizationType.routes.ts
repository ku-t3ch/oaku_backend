import { Router } from "express";
import {
  getOrganizationTypes,
  getOrganizationsByCampusId,
} from "../controllers/organizationType.controller";
import {
  authenticateJWT,
  adminOnly,
  superAdminOnly,
  headOrAdminOnly,
  ALLROLE,
} from "../middlewares/auth.middleware";

const router = Router();

// GET /organization-types
router.get("/", authenticateJWT, ALLROLE, getOrganizationTypes);

// GET /organizations?campusId=CAMPUS_ID
router.get(
  "/organizations",
  authenticateJWT,
  ALLROLE,
  getOrganizationsByCampusId
);
