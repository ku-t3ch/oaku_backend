import { Router } from "express";
import { 
  authenticateJWT, 
  requireCampusAdmin, 
  requireSuperAdmin 
} from "../middlewares/auth.middleware";
import { 
  addRoleAdminToUser, 
  getAllUsers,
  getAllUsersByRoleORCampus,
  editInfoUser
} from "../controllers/user.controller";

const router = Router();

// GET /user/get-users 
// GET /user/get-usersbyRoleORCampus body: { role: Role, campusId: string }
router.get("/get-users", authenticateJWT, requireSuperAdmin, getAllUsers);
router.get("/get-usersbyRoleOrCampus",authenticateJWT,requireCampusAdmin,getAllUsersByRoleORCampus);

// PUT /user/edit-info-user/:userId body: { name: string, email: string, phoneNumber?: string, image?: string }
router.put("/edit-info-user/:userId", authenticateJWT, requireCampusAdmin, editInfoUser);

// POST /user/add-role-admin/:userId/:role body: { campusId: string->CAMPUS_ADMIN || null ->SUPER_ADMIN} 
router.post("/add-role-admin/:userId/:role", authenticateJWT, requireSuperAdmin, addRoleAdminToUser);

export default router;

