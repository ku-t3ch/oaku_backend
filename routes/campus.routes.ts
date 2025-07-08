import { Router } from "express";
import { 
  authenticateJWT, 
  requireCampusAdmin, 
  requireSuperAdmin 
} from "../middlewares/auth.middleware";
import { 
    getAllCampuses
} from "../controllers/campus.controller";

const router = Router()


// GET /campus/get-campuses Body: {}
router.get("/get-campuses", authenticateJWT, getAllCampuses);
