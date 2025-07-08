import { Router } from "express";
import { 
  authenticateJWT, 
  requireCampusAdmin, 
  requireSuperAdmin 
} from "../middlewares/auth.middleware";
import { 
  addRoleAdminToUser, 
  getAllUsers,
  getUserByCampusId,
  getUserByRole
} from "../controllers/user.controller";

const router = Router();

// GET /user/get-users 
// GET /user/get-usersbycampus
// GET /user/get-usersbyrole body:(role: Role)
router.get("/get-users", authenticateJWT, requireSuperAdmin, getAllUsers);
router.get("/get-usersbycampus", authenticateJWT, requireCampusAdmin, getUserByCampusId);
router.get("/get-usersbyrole", authenticateJWT, requireSuperAdmin, getUserByRole);

// POST /user/add-role-admin/:userId/:role body: { campusId: string->CAMPUS_ADMIN || null ->SUPER_ADMIN} 
router.post("/add-role-admin/:userId/:role", authenticateJWT, requireSuperAdmin, addRoleAdminToUser);

export default router;

