import { Router } from "express";
import { newLoan, updateStatus, getLoan } from "../controller/loanController";

const router = Router({ mergeParams: true });

router.post("/loans", newLoan);
router.get("/customer/:id/loans", getLoan);
router.patch("/loans/:id/status", updateStatus);

export default router;