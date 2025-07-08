import { Router } from "express";
import { 
  authenticateJWT, 
  requireCampusAdmin, 
  requireSuperAdmin 
} from "../middlewares/auth.middleware";
import { 
    createOrganization,
    getAllOrganizations
} from "../controllers/organization.controller";

const router = Router()

// POST /organization/create-organization body: { nameTh: string, nameEn: string, publicOrganizationId: string, campusId: string, organizationTypeId: string }
router.post("/create-organization", authenticateJWT, requireSuperAdmin, createOrganization)


router.get("/get-organization", authenticateJWT, requireSuperAdmin, getAllOrganizations)



export default router;