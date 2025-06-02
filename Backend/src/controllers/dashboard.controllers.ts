import { Response } from "express";
import { AuthRequest } from "../middlewares/protectRoute";
import Dashboard from "../models/dashboard.model";

export const getDashboardSummary = async (req: AuthRequest, res: Response) => {
  try {
    const summary = {
      totalIncome: 5000,
      totalExpense: 3200,
      netSavings: 1800,
    };
    res.status(200).json(summary);
  } 
  catch (error) {
    res.status(500).json({ message: "Failed to fetch dashboard summary" });
  }
};

export const getCategoryBreakdown = async (req: AuthRequest, res: Response) => {
  try {
    const breakdown = [
      { category: "Food", amount: 1200 },
      { category: "Transport", amount: 400 },
      { category: "Rent", amount: 1000 },
      { category: "Entertainment", amount: 600 },
    ];
    res.status(200).json(breakdown);
  } 
  catch (error) {
    res.status(500).json({ message: "Failed to fetch category breakdown" });
  }
};

export const getMonthlyTrend = async (req: AuthRequest, res: Response) => {
  try {
    const trend = [
      { month: "Jan", income: 5000, expense: 3000 },
      { month: "Feb", income: 4500, expense: 3100 },
      { month: "Mar", income: 5200, expense: 2900 },
    ];
    res.status(200).json(trend);
  } 
  catch (error) {
    res.status(500).json({ message: "Failed to fetch monthly trend" });
  }
};

export const getDailyStats = async (req: AuthRequest, res: Response) => {
  try {
    const stats = [
      { date: "2025-05-20", income: 200, expense: 150 },
      { date: "2025-05-21", income: 100, expense: 180 },
      { date: "2025-05-22", income: 250, expense: 200 },
    ];
    res.status(200).json(stats);
  } 
  catch (error) {
    res.status(500).json({ message: "Failed to fetch daily stats" });
  }
};

export const getSpendingAlerts = async (req: AuthRequest, res: Response) => {
  try {
    const alerts = [
      { message: "High spending on Food this month!", level: "warning" },
      { message: "Transport budget exceeded", level: "critical" },
    ];
    res.status(200).json(alerts);
  } 
  catch (error) {
    res.status(500).json({ message: "Failed to fetch spending alerts" });
  }
};
