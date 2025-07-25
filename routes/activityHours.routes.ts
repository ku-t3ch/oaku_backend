import { Router } from "express";
import multer from "multer";
import { uploadActivityHour, getActivityHourFile } from "../controllers/activityHours.controller";
import {
  authenticateJWT,
  adminOnly,
  superAdminOnly,
  headOrAdminOnly,
  ALLROLE,
} from "../middlewares/auth.middleware";

const router = Router();
const upload = multer(); 

router.post(
  "/upload",
  authenticateJWT,
  ALLROLE,
  upload.single("file"), 
  uploadActivityHour
);

router.get(
  "/file/:filename",
  authenticateJWT,
  headOrAdminOnly,
  getActivityHourFile
);

export default router;