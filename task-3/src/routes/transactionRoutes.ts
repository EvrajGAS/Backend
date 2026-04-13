import { Router } from "express";
import { createTransaction, getTransactionbyID } from "../controller/transactionController";

const router = Router({ mergeParams: true });

router.post("/transactions", createTransaction);
router.get("/accounts/:id/transactions", getTransactionbyID);

export default router;