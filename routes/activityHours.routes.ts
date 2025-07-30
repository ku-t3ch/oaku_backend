import { Router } from "express";
import multer from "multer";
import {
  uploadActivityHour,
  // getActivityHourFile,
  downloadActivityHourFile,
  deleteActivityHourFile,
} from "../controllers/activityHours.controller";
import {
  authenticateJWT,
  headOrAdminOnly,
  ALLROLE,
} from "../middlewares/auth.middleware";

const router = Router();
const upload = multer();

// อัปโหลดไฟล์ activity hour
router.post(
  "/upload",
  authenticateJWT,
  ALLROLE,
  upload.single("file"),
  uploadActivityHour
);

// ดาวน์โหลดไฟล์ activity hour จาก S3
router.get(
  "/download/:projectId/:fileNamePrinciple",
  authenticateJWT,
  ALLROLE,
  downloadActivityHourFile
);

// ลบไฟล์ activity hour
router.delete(
  "/:id",
  authenticateJWT,
  headOrAdminOnly,
  deleteActivityHourFile
);

// ดูไฟล์ activity hour (เฉพาะหัวหน้าหรือแอดมิน)
// router.get(
//   "/file/:filename",
//   authenticateJWT,
//   headOrAdminOnly,
//   getActivityHourFile
// );

export default router;