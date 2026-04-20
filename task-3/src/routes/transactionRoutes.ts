import  Router  from "@koa/router";
import { createTransaction, getTransactionbyID } from "../controller/transactionController";

const router = new Router();

router.post("/transactions", createTransaction);
router.get("/accounts/:id/transactions", getTransactionbyID);

export default router;