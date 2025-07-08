import { Router } from "express";
import { 
  authenticateJWT, 
  requireCampusAdmin, 
  requireSuperAdmin 
} from "../middlewares/auth.middleware";
import { 
    createOrganization
} from "../controllers/organization.controller";

const router = Router()

router.post("/create-organization", authenticateJWT, requireSuperAdmin, createOrganization)

export default router;