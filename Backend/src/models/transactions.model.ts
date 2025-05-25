import mongoose, { Document, Schema } from "mongoose";

export interface TransactionType extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  amount: number;
  date: Date;
  category: string;
  type: "income" | "expense";
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<TransactionType>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
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

const Transactions = mongoose.model<TransactionType>("Transaction", transactionSchema);
export default Transactions;