import { Request, Response} from "express";
import Transactions , {TransactionType} from "../models/transactions.model";


export const getUserTransactions = async (req: Request, res: Response) : Promise<void> => {
  try {
    const userId = req

    const transactions = await Transactions.find({ userId }).sort({ date: -1 });

    res.status(200).json(transactions);
    return;
  } catch (error) {
    res.status(500).json({ message: "error fetching transactions", error });
  }
};



export const createNewTransaction = async (req: Request, res: Response) : Promise<void> => {
  try {
    const { title, amount, date, category, type } = req.body;
    const userId = req.id;

    if (!title || !amount || !date || !category || !type) {
      res.status(400).json({ message: "all fields are required" });
      return;
    }

    const newTransaction = await Transactions.create({
      title,
      amount,
      date,
      category,
      type,
      userId,
    });

    res.status(201).json(newTransaction);
  } 
  catch (error) {
    res.status(500).json({ message: "error creating transaction", error });
    return;
  }
};



export const updateUserTransactions = async (req: Request, res: Response) : Promise<void> => {
  try {
    const userId = req.id;
    const { id } = req.params;

    const updated = await Transactions.findOneAndUpdate(
      { id: id, userId },
      req.body,
      { new: true }
    );

    if (!updated) {
      res.status(404).json({ message: "Transactions not found" });
      return;
    }

    res.status(200).json(updated);
  } 
  catch (error) {
    res.status(500).json({ message: "Error updating transaction", error });
    return;
  }
};



export const deleteUserTransaction = async (req: Request, res: Response) : Promise<void> => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const deleted = await Transactions.findOneAndDelete({ id: id, userId });

    if (!deleted) {
      res.status(404).json({ message: "transactions not found" });
      return;
    }

    res.status(200).json({ message: "transactions deleted successfully" });
  } 
  catch (error) {
    res.status(500).json({ message: "error deleting transaction", error });
    return;
  }
};
