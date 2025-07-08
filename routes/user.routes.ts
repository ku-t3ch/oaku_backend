import { Router } from "express";
import { 
  authenticateJWT, 
  requireCampusAdmin, 
  requireSuperAdmin 
} from "../middlewares/auth.middleware";
import { 
  addRoleAdminToUser, 
  getAllUsers 
} from "../controllers/user.controller";

const router = Router();

// GET /user/get-users 
router.get("/get-users", authenticateJWT, requireSuperAdmin, getAllUsers);

// POST /user/add-role-admin/:userId/:role body: { campusId: string->CAMPUS_ADMIN || null ->SUPER_ADMIN} 

router.post("/add-role-admin/:userId/:role", authenticateJWT, requireSuperAdmin, addRoleAdminToUser);

export default router;

