import  Router  from "@koa/router";
import { newLoan, updateStatus, getLoan } from "../controller/loanController";

const router = new Router();

router.post("/loans", newLoan);
router.get("/customer/:id/loans", getLoan);
router.patch("/loans/:id/status", updateStatus);

export default router;