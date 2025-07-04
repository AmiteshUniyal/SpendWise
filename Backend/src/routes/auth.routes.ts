import express from "express";
import { protectRoute } from "../middlewares/protectRoute";
import { login, signup, logout, getMe, saveCreds } from "../controllers/auth.controllers";


const router = express.Router();

router.get("/me", protectRoute, getMe);
router.post("/login", login );
router.post('/signup', signup );
router.post('/logout', logout );
router.post("/save", protectRoute, saveCreds);

export default router;