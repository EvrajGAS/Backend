import  Router  from "@koa/router";
import { createKYC, updateKYC, getKYC } from "../controller/kycController";

const router = new  Router({ prefix: "/customer/:id/kyc" });

router.post("/", createKYC);
router.get("/", getKYC);
router.put("/", updateKYC);

export default router;