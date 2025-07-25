import { Router } from "express";
import { getProjects,createProject} from "../controllers/project.controller";
import { authenticateJWT, ALLROLE  } from "../middlewares/auth.middleware";

const router = Router();

//GET /projects Body: {campusId: string, organizationTypeId: string, organizationId: string}
router.get("/", authenticateJWT, ALLROLE, getProjects);

//POST /projects 
router.post("/", authenticateJWT, ALLROLE, createProject);

export default router;