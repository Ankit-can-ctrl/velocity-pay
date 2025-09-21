import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .json({ message: "Account with this email already exist!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    return res
      .status(201)
      .json({ token, message: "User created successfully :)" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong while creating new user:(" });
  }
};

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user)
      return res.status(400).json({
        message: "Invalid credentials!",
      });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password!" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    return res
      .status(201)
      .json({ token, message: "Logged in successfully :)" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong while signing in :(" });
  }
};
