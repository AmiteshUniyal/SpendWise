import { Response } from "express";
import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId: string, res: Response): void => {

  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "15d" });

  res.cookie("jwtToken", token, {
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",     
    maxAge: 10 * 24 * 60 * 60 * 1000,
  });
};
