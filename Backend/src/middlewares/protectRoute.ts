import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { UserDocument } from "../models/user.model";

export interface AuthRequest extends Request {
  user?: UserDocument;
}

export const protectRoute = async ( req: AuthRequest, res: Response, next: NextFunction ): Promise<void> => {
  
  try {
    const token = req.cookies?.jwtToken; 

    if (!token) {
      res.status(401).json({ error: "Unauthorized: No Token Provided" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    if (!decoded || typeof decoded !== "object" || !decoded.userId) {
      res.status(401).json({ error: "Unauthorized: Invalid Token" });
      return;
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    req.user = user;
    next();
  } 
  catch (error: any) {
    console.error("Error in protectRoute middleware", error.message);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
};
