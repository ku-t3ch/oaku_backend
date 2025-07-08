import { Router, Request, Response } from "express";
import passport, { authenticate } from "passport";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { createUser ,getAllUsers} from "../controllers/user.controller";

const router = Router();

router.post("/create-user", authenticateJWT, createUser);
router.get("/get-users", authenticateJWT,getAllUsers);

export default router;
