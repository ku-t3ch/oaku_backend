import { Router } from "express";
import {
  getUsers,
  getUsersByRoleOrCampusIdOrOrganizationTypeIdOrOrganizationId,
  getUserById,
  editInfoUser,
  AddOrRemoveCampusAdmin,
  AddSuperAdmin,
  AddUserToOrganizationTypeAndOrganization,
  SuperAdminSuspendUser,
  CampusAdminSuspendUser,
} from "../controllers/users.controller";
import {
  authenticateJWT,
  adminOnly,
  superAdminOnly,
  headOrAdminOnly,
  ALLROLE,
} from "../middlewares/auth.middleware";

const router = Router();

// GET /users
router.get("/", authenticateJWT, superAdminOnly, getUsers);

// GET /users/filter?role=ROLE_NAME&campusId=...&organizationTypeId=...&organizationId=...&position=...
router.get(
  "/filter",
  authenticateJWT,
  headOrAdminOnly,
  getUsersByRoleOrCampusIdOrOrganizationTypeIdOrOrganizationId
);

// GET /users/:id
router.get("/:id", authenticateJWT, ALLROLE, getUserById);

// PUT /users/:id
router.put("/:id", authenticateJWT, headOrAdminOnly, editInfoUser);

// PUT /users/:id/suspend
router.put(
  "/:id/suspend",
  authenticateJWT,
  superAdminOnly,
  SuperAdminSuspendUser
);

// PUT /users/:id/organization/:organizationId/suspend
router.put(
  "/:id/organization/:organizationId/suspend",
  authenticateJWT,
  headOrAdminOnly,
  CampusAdminSuspendUser
);

// POST /users/:id/admin
router.post(
  "/:id/admin",
  authenticateJWT,
  superAdminOnly,
  AddOrRemoveCampusAdmin
);

// POST /users/:id/superadmin
router.post(
  "/:id/superadmin",
  authenticateJWT,
  superAdminOnly,
  AddSuperAdmin
);

// POST /users/:id/organization
router.post(
  "/:id/organization",
  authenticateJWT,
  adminOnly,
  AddUserToOrganizationTypeAndOrganization
);

export default router;