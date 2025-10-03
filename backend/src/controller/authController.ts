import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Account from "../models/account";

function getRandomBalance(min = 1000, max = 10000) {
  const amount = Math.floor(Math.random() * (max - min + 1) + min);
  return amount * 100;
}

function getRandomSigninBalance(min = 1000, max = 5000) {
  const amount = Math.floor(Math.random() * (max - min + 1) + min);
  return amount * 100;
}

export const signup = async (req: Request, res: Response) => {
  const { name, username, email, password } = req.body;

  try {
    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername)
      return res.status(400).json({ message: "Username already taken!" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .json({ message: "Account with this email already exist!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    const account = await Account.create({
      user: user._id,
      email: user.email,
      balance: getRandomBalance(),
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    return res
      .status(201)
      .json({ token, message: "User account created successfully :)" });
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

    const updatedAccount = await Account.findOneAndUpdate(
      { user: user._id },
      { balance: getRandomSigninBalance() },
      { new: true } //return updated document
    );

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
