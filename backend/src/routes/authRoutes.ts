import express from "express";
import { validateRequest } from "../middleware/validateRequest";
import { signin, signup } from "../controller/authController";
import z, { email } from "zod";
import { authenticateToken } from "../middleware/authMiddleware";
import { updateDetails } from "../controller/userController";

const router = express.Router();

// as we know validate request middleware requires a schema as params

// signup schema
const signupSchema = z.object({
  name: z.string().min(3),
  email: z.email(),
  password: z.string().min(8),
});

// signin schema
const signinSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

router.use("/signup", validateRequest(signupSchema), signup);
router.use("/signin", validateRequest(signinSchema), signin);
router.put("/update", authenticateToken, updateDetails);

export default router;
