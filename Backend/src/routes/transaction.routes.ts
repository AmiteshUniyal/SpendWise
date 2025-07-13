import express from "express";
import { protectRoute } from "../middlewares/protectRoute";
import { getUserTransactions, createNewTransaction, updateUserTransactions, deleteUserTransaction } from "../controllers/transaction.controllers";
import { validate } from "../middlewares/validateData";
import { createTransactionSchema } from "../zodSchemas/transaction.schema";

const router = express.Router();

router.get("/all", protectRoute, getUserTransactions);
router.post("/create", protectRoute, validate(createTransactionSchema), createNewTransaction);
router.put("/update/:id", protectRoute, validate(createTransactionSchema.partial()), updateUserTransactions);
router.delete("/delete/:id", protectRoute, deleteUserTransaction);

export default router;