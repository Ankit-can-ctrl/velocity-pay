import { Response, Request } from "express";
import Account from "../models/account";
import mongoose from "mongoose";
import User from "../models/User";

function toMoneyInt(balance: number) {
  return balance * 100;
}

function fromMoneyInt(balance: number) {
  return (balance / 100).toFixed(2);
}

export const getBalance = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const account = await Account.findOne({ user: userId });

    if (!account) return res.status(404).json({ message: "User not found." });

    res.status(200).json({ balance: fromMoneyInt(account.balance) });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while fetching account balance.",
    });
  }
};

export const fundTransfer = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const from = req.userId;
    const { receiverDetails, amount } = req.body;

    const transferAmount = toMoneyInt(amount);

    if (!transferAmount || transferAmount == 0) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ message: "Enter valid amount to transfer." });
    }

    const to = await User.findOne({
      $or: [{ username: receiverDetails }, { email: receiverDetails }],
    });

    if (from?.toString() === to?._id?.toString())
      return res
        .status(400)
        .json({ message: "Sender and receiver cannot be same." });

    const sender = await Account.findOne({ user: from }).session(session);
    const receiver = await Account.findOne({ user: to }).session(session);

    if (!sender || !receiver) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ message: "Sender or receiver account not found." });
    }

    if (sender.balance < amount)
      return res.status(400).json({ message: "Insufficient balance." });

    // update amount
    sender.balance -= transferAmount;
    receiver.balance += transferAmount;

    await sender.save({ session });
    await receiver.save({ session });

    // commit transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      message: "Transaction successful.",
      from: sender.email,
      to: receiver.email,
      amount,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Fund transfer failed." });
  }
};
