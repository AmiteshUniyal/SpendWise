import mongoose, { Document, Schema } from "mongoose";

interface TransactionType {
  userId: mongoose.Types.ObjectId;
  title: string;
  amount: number;
  date: Date;
  category: string;
  type: "income" | "expense";
  createdAt: Date;
  updatedAt: Date;
}

export type TransactionDocument = TransactionType & Document;

const transactionSchema = new Schema<TransactionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
  },
  { timestamps: true }
);

const Transactions = mongoose.model<TransactionDocument>("Transaction", transactionSchema);
export default Transactions;