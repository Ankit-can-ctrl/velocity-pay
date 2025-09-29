import { Request, Response } from "express";
import z from "zod";
import bcrypt from "bcrypt";
import User from "../models/User";

const updateUserSchema = z
  .object({
    name: z.string().min(2, "Name must be greater than 2 letters!").optional(),
    password: z
      .string()
      .min(8, "Password must be atleast 8 characters long.")
      .optional(),
  })
  .refine((data) => data.name || data.password, {
    message: "Atleast one field must be provided",
    path: ["name", "password"], //apply error to both fields
  });

export const updateDetails = async (req: Request, res: Response) => {
  try {
    const parsed = updateUserSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error?.format() });
    }

    const { name, password } = parsed.data;

    const user = await User.findById(req.userId);
    console.log(req.body);
    if (!user) return res.status(404).json({ message: "User not found!" });

    if (name) user!.name = name;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user!.password = hashedPassword;
    }

    await user!.save();

    res.json({ message: "Profile updated successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong while updating details." });
  }
};
