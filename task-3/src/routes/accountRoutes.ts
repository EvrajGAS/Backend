import Router from "@koa/router";
import { createAccount, getAccounts, getAccountbyID, deleteAccount } from "../controller/accountController";

const router = new Router({
    prefix: "/accounts",
});

router.post("/", createAccount);
router.get("/", getAccounts);
router.get("/:id", getAccountbyID);
router.delete("/:id", deleteAccount);

export default router;