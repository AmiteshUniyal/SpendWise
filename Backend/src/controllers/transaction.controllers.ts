import { Response } from "express";
import Transactions, { TransactionDocument } from "../models/transactions.model";
import { AuthRequest } from "../middlewares/protectRoute";


export const getUserTransactions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;

    const transactions = await Transactions.find({ userId }).sort({ date: -1 });
    res.status(200).json(transactions);
  } 
  catch (error) {
    res.status(500).json({ message: "Error fetching transactions", error });
    return;
  }
};

export const createNewTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, amount, date, category, type } = req.body;
    const userId = req.user?._id;

    if (!title || !amount || !date || !category || !type) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const newTransaction: TransactionDocument = await Transactions.create({
      userId,
      title,
      amount,
      date,
      category,
      type,
    });

    res.status(201).json(newTransaction);
  } 
  catch (error) {
    res.status(500).json({ message: "Error creating transaction", error });
  }
};

export const updateUserTransactions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;

    const updated = await Transactions.findOneAndUpdate(
      { _id: id, userId },
      req.body,
      { new: true }
    );

    if (!updated) {
      res.status(404).json({ message: "Transaction not found" });
      return;
    }

    res.status(200).json(updated);
  } 
  catch (error) {
    res.status(500).json({ message: "Error updating transaction", error });
  }
};

export const deleteUserTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;

    const deleted = await Transactions.findOneAndDelete({ _id: id, userId });

    if (!deleted) {
      res.status(404).json({ message: "Transaction not found" });
      return;
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } 
  catch (error) {
    res.status(500).json({ message: "Error deleting transaction", error });
  }
};
