import mongoose, { Schema, Document } from "mongoose";

interface UserType {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  income: number;
  currency: string;
  goal: string;
  goalAmount: number;
  goalSetDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = UserType & Document; 

const userSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    }, 
    income: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "",
    },
    goal: {
      type: String,
      default: "",
    },
    goalAmount:{
      type: Number,
      default: 0,
    },
    goalSetDate:{
      type: Date,
    }
  },
  { timestamps: true }
);

const User = mongoose.model<UserDocument>("User", userSchema);
export default User;
