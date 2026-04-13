import { Router } from "express";
import { createAccount, getAccounts, getAccountbyID, deleteAccount } from "../controller/accountController";

const router = Router({ mergeParams: true });

router.post("/", createAccount);
router.get("/", getAccounts);
router.get("/:id", getAccountbyID);
router.delete("/:id", deleteAccount);

export default router;