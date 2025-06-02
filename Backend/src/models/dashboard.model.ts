import mongoose, { Document, Schema } from "mongoose";


export interface DailyExpenses {
    date: string;
    amount: number;
}

const dailyExpenseSchema = new Schema<DailyExpenses>(
  {
    date: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/, // "YYYY-MM-DD"
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);



export interface CategoryBreakdown {
    category: string;
    amount: number;
}


const categorySchema = new Schema<CategoryBreakdown>(
    {
        category: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
    },
    { _id: false }
);



export interface DashboardDocument extends Document {
  user: mongoose.Types.ObjectId;
  month: string;
  
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  budgetGoal: number;
  savingsGoal: number;

  dailyExpenses: DailyExpenses[];
  categoryBreakdown: CategoryBreakdown[];

  createdAt: Date;
  updatedAt: Date;
}


const dashboardSchema = new Schema<DashboardDocument>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    month: {
      type: String,
      required: true,
      match: /^\d{4}-(0[1-9]|1[0-2])$/, // "YYYY-MM"
    },
    totalIncome: {
      type: Number,
      required: true,
      default: 0,
    },
    totalExpense: {
      type: Number,
      required: true,
      default: 0,
    },
    netSavings: {
      type: Number,
      required: true,
      default: 0,
    },
    budgetGoal: {
      type: Number,
      required: true,
      default: 0,
    },
    savingsGoal: {
      type: Number,
      required: true,
      default: 0,
    },
    dailyExpenses: {
      type: [dailyExpenseSchema],
      default: [],
    },
    categoryBreakdown: {
      type: [categorySchema],
      default: [],
    },
  },
  { timestamps: true }
);

const Dashboard = mongoose.model<DashboardDocument>("Dashboard", dashboardSchema);

export default Dashboard;
