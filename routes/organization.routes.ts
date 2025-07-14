import e, { Router } from "express";
import {
  getOrganizations,
  createOrganization,
  editOrganization,
  getOrganizationsAndUserInOrganizationById,
} from "../controllers/organization.controller";
import {
  authenticateJWT,
  adminOnly,
  superAdminOnly,
  headOrAdminOnly,
  ALLROLE,

} from "../middlewares/auth.middleware";

const router = Router();

// GET /organizations?campusId=CAMPUS_ID&organizationTypeId=ORGANIZATION_TYPE_ID
router.get("/", authenticateJWT, ALLROLE, getOrganizations);

// GET /organizations/:id
router.get("/:id", authenticateJWT, ALLROLE, getOrganizationsAndUserInOrganizationById);

// PUT /organizations/:id
router.put("/:id", authenticateJWT, headOrAdminOnly, editOrganization);

// POST /organizations 
router.post("/", authenticateJWT, superAdminOnly, createOrganization);

export default router;