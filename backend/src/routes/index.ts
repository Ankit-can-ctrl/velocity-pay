import express from "express";
import userRouter from "./authRoutes";

const router = express.Router();

router.use("/user", userRouter);

export default router;
