import { Router } from "express";
import { uploadActivityHour,getActivityHourFile } from "../controllers/activityHours.controller";
import {
  authenticateJWT,
  adminOnly,
  superAdminOnly,
  headOrAdminOnly,
  ALLROLE,
} from "../middlewares/auth.middleware";
const router = Router();

router.post("/upload", authenticateJWT, ALLROLE, uploadActivityHour);

router.get(
  "/file/:filename",
  authenticateJWT,
  headOrAdminOnly,
  getActivityHourFile
);

export default router;