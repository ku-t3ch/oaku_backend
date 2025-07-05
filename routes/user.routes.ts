import { Router, Request, Response } from "express";
import passport, { authenticate } from "passport";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { createUser } from "../controllers/user.controller";

const router = Router();

router.post("/create-user", authenticateJWT, createUser);
