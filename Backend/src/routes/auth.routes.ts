import express from "express";
import { protectRoute } from "../middlewares/protectRoute";
import { login, signup, logout, getMe } from "../controllers/auth.controllers";


const router = express.Router();

router.post("/login", login );
router.post('/signup', signup );
router.post('/logout', logout );
router.get("/me", protectRoute, getMe);

export default router;