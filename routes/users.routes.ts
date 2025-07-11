import { Router } from "express";
import {
  getUsers,
  getUsersByRoleOrCampusIdOrOrganizationTypeIdOrOrganizationId,
  getUserByUserId,
  editInfoUser,
  AddOrRemoveCampusAdmin,
  AddSuperAdmin,
  AddUserToOrganizationTypeAndOrganization,
} from "../controllers/users.controller";
import {
  authenticateJWT,
  adminOnly,
  superAdminOnly,
  headOrAdminOnly,
  ALLROLE,
} from "../middlewares/auth.middleware";

const router = Router();

//GET /users
router.get("/", authenticateJWT, superAdminOnly, getUsers);

//GET /users?role=ROLE_NAME&campusId=CAMPUS_ID&organizationTypeId=ORGANIZATION_TYPE_ID&organizationId=ORGANIZATION_ID
router.get(
  "/filter",
  authenticateJWT,
  headOrAdminOnly,
  getUsersByRoleOrCampusIdOrOrganizationTypeIdOrOrganizationId
);

//GET /users/:id
router.get("/:id", authenticateJWT, headOrAdminOnly, getUserByUserId);

//PUT /users/:id
router.put("/:id", authenticateJWT, headOrAdminOnly, editInfoUser);

//POST /users/:id/admin
router.post(
  "/:id/admin",
  authenticateJWT,
  superAdminOnly,
  AddOrRemoveCampusAdmin
);

//POST /users/:id/superadmin
router.post("/:id/superadmin", authenticateJWT, superAdminOnly, AddSuperAdmin);

//POST /users/:id/organization
router.post(
  "/:id/organization",
  authenticateJWT,
  adminOnly,
  AddUserToOrganizationTypeAndOrganization
);

export default router;
