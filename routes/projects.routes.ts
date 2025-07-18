import { Router } from "express";
import { getProjects} from "../controllers/project.controller";
import { authenticateJWT, ALLROLE } from "../middlewares/auth.middleware";

const router = Router();

//GET /projects Body: {campusId: string, organizationTypeId: string, organizationId: string}
router.get("/", authenticateJWT, ALLROLE, getProjects);

export default router;