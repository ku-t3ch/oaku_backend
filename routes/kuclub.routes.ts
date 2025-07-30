import { Router } from "express";
import {
  getAllCampus,
  getAllOrganizations,
  getAllOrganizationsType,
  getAllProjects,
} from "../controllers/kuclub..controller";

const router = Router();

router.get("/campus", getAllCampus);
//GET /organizations, /organizations/type, /projects
router.get("/organizations", getAllOrganizations);
router.get("/organizationsType", getAllOrganizationsType);
router.get("/projects", getAllProjects);

export default router;
