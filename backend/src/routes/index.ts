import express from "express";
import userRouter from "./userRoutes";
import accountsRouter from "./accountRoutes";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

router.use("/user", userRouter);
router.use("/accounts", authenticateToken, accountsRouter);

export default router;
