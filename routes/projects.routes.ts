import { Router } from "express";
import multer from "multer";
import {
  getProjects,
  getProjectById,
  createProject,
  completeActivityHourInProject,
  uploadDocPdfInProject,
  deleteDocPdfInProject,
} from "../controllers/project.controller";
import { authenticateJWT, ALLROLE } from "../middlewares/auth.middleware";

const router = Router();
const upload = multer(); // ใช้ multer สำหรับรับไฟล์

// GET /projects
router.get("/", authenticateJWT, ALLROLE, getProjects);

// GET /projects/:id
router.get("/:id", authenticateJWT, ALLROLE, getProjectById);

// POST /projects
router.post("/", authenticateJWT, ALLROLE, createProject);

// POST /projects/:projectId/document-file (อัปโหลดไฟล์ PDF เอกสารโครงการ)
router.post(
  "/:projectId/document-file",
  authenticateJWT,
  ALLROLE,
  upload.single("file"),
  uploadDocPdfInProject
);
// DELETE /projects/:projectId/pdf-file
router.delete(
  "/:projectId/document-file",
  authenticateJWT,
  ALLROLE,
  deleteDocPdfInProject
);

// PATCH /projects/:projectId/activity-hour-file/:activityHourFileId/complete (อัปเดตสถานะไฟล์ activity hour เป็น completed)
router.patch(
  "/:projectId/activity-hour-file/:activityHourFileId/complete",
  authenticateJWT,
  ALLROLE,
  completeActivityHourInProject
);
// POST /projects/:projectId/activity-hour-file (อัปโหลดไฟล์ activity hour)
// router.post(
//   "/:projectId/activity-hour-file",
//   authenticateJWT,
//   ALLROLE,
//   upload.single("file"),
//   uploadFileActivityHourInProject
// );

export default router;
