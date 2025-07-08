import { Router } from "express";
import { 
  authenticateJWT, 
  requireCampusAdmin, 
  requireSuperAdmin 
} from "../middlewares/auth.middleware";
import{
    getAllOrganizationsType,
    getAllOrganizationsTypeByCampusId
} from "../controllers/organizationType.controller";

const router = Router();

// GET /organizationType/get-organization-type
// GET /organizationType/get-organization-type-by-campus/:campusId body: {campusId: string}
router.get("/get-organization-type", authenticateJWT, requireCampusAdmin, getAllOrganizationsType);
router.get("/get-organization-type-by-campus/:campusId", authenticateJWT, requireCampusAdmin, getAllOrganizationsTypeByCampusId);

export default router;
