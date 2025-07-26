import { Router } from "express";
import multer from "multer";
import { getProjects, getProjectById, createProject, uploadFileActivityHourInProject } from "../controllers/project.controller";
import { authenticateJWT, ALLROLE  } from "../middlewares/auth.middleware";

const router = Router();
const upload = multer(); // เพิ่ม multer

//GET /projects Body: {campusId: string, organizationTypeId: string, organizationId: string}
router.get("/", authenticateJWT, ALLROLE, getProjects);

//GET /projects/:id
router.get("/:id", authenticateJWT, ALLROLE, getProjectById);

//POST /projects 
router.post("/", authenticateJWT, ALLROLE, createProject);

// POST /projects/:projectId/activity-hour-file (for file upload)
router.post(
  "/:projectId/activity-hour-file",
  authenticateJWT,
  ALLROLE,
  upload.single("file"), // เพิ่ม middleware สำหรับรับไฟล์
  uploadFileActivityHourInProject
);

export default router;