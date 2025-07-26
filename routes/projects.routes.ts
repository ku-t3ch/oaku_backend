import { Router } from "express";
import { getProjects,getProjectById,createProject} from "../controllers/project.controller";

import { authenticateJWT, ALLROLE  } from "../middlewares/auth.middleware";

const router = Router();

//GET /projects Body: {campusId: string, organizationTypeId: string, organizationId: string}
router.get("/", authenticateJWT, ALLROLE, getProjects);

//GET /projects/:id
router.get("/:id", authenticateJWT, ALLROLE, getProjectById);

//POST /projects 
router.post("/", authenticateJWT, ALLROLE, createProject);



export default router;