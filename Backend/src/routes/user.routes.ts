import express from "express";
import { protectRoute } from "../middlewares/protectRoute";


const router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile );
router.post("/update", protectRoute, updateUserProfile );

export default router;