import { Router } from "express";
import { createKYC, updateKYC, getKYC } from "../controller/kycController";

const router = Router({ mergeParams: true });

router.post("/", createKYC);
router.get("/", getKYC);
router.put("/", updateKYC);

export default router;