import express from "express";
import { protectRoute } from "../middlewares/protectRoute";


const router = express.Router();

router.get("/summary", protectRoute, getDashboardSummary);
router.get("/category-breakdown", protectRoute,  getCategoryBreakdown);
router.get("/monthly",  protectRoute, getMonthlyTrend);
router.get("/daily", protectRoute,  getDailyStats);
router.get("/spending-alerts", protectRoute, getSpendingAlerts);


export default router;