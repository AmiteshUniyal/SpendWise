import { Request, Response } from "express";
import { generateTokenAndSetCookie } from '../utils/generateToken'
import User, { UserDocument } from "../models/user.model";
import { AuthRequest } from "../middlewares/protectRoute";
import bcrypt from "bcryptjs";


interface signupRequest extends Request {
    body: {
        username: string;
        email: string;
        password: string;
        confirmPassword: string;
    }
}

interface loginRequest extends Request {
    body: {
        username: string;
        password: string;
    }
}

export const login = async (req: loginRequest, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            res.status(400).json({ error: "Username and Password are required" });
            return;
        }

        const user : UserDocument | null = await User.findOne({ username });
        
        if (!user || !user.password) {
            res.status(400).json({ error: "Invalid Username or Password" });
            return;
        }
        
        const correctPassword = await bcrypt.compare(password, user.password);

        if (!correctPassword) {
            res.status(400).json({ error: "Invalid Username or Password" });
            return;
        }
        
        generateTokenAndSetCookie(user._id.toString(), res);
        
        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
        });
    } 
    catch (error: any) {
        console.error("Error in login controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const signup = async (req: signupRequest, res: Response): Promise<void> => {
    try {
        const { username, email, password } = req.body;
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            res.status(400).json({ error: "Invalid Email" });
            return;
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            res.status(400).json({ error: "Username is already taken" });
            return;
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            res.status(400).json({ error: "Email is already taken" });
            return;
        }

        if (password.length < 6) {
            res.status(400).json({ error: "Password must be at least 6 characters long" });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser : UserDocument = new User({
            username,
            email,
            password: hashedPassword,
        });

        if (newUser) {
            generateTokenAndSetCookie(newUser._id.toString(), res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
            });
        } 
        else {
            res.status(400).json({ error: "Invalid user data" });
        }
    } 
    catch (error: any) {
        console.error("Error in signup controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const logout = (_req: Request, res: Response): void => {
    try {
        res.clearCookie("jwtToken", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
        });

        res.cookie("jwtToken", "", {
            expires: new Date(0),
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
        });
        res.status(200).json({ message: "Logged out Successfully" });
    } 
    catch (error: any) {
        console.error("Error in logout controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
        return;
    }
};


export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    try {

        const user = await User.findById(req.user?._id).select("-password");

        res.status(200).json(user);
    } 
    catch (error: any) {
        console.error("Error in getMe controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
        return;
    }
};

export const saveCreds = async (req: AuthRequest, res: Response): Promise<void> => {
    try {

        const updated = await User.findOneAndUpdate(req.user?._id, req.body).select("-password");
              
        if (!updated) {
            res.status(404).json({ message: "Credentials not found" });
            return;
        }

        res.status(200).json(updated);
    } 
    catch (error: any) {
        console.error("Error in saveCreds controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
        return;
    }
};