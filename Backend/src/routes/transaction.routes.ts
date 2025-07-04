import express from "express";
import { protectRoute } from "../middlewares/protectRoute";
import {getUserTransactions, createNewTransaction, updateUserTransactions, deleteUserTransaction} from "../controllers/transaction.controllers"

const router = express.Router();

router.get("/all", protectRoute, getUserTransactions);
router.post("/create", protectRoute, createNewTransaction);
router.put("/update/:id", protectRoute, updateUserTransactions);
router.delete("/delete/:id", protectRoute, deleteUserTransaction);

export default router;