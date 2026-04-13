import { Router } from "express";
import { createService, getServices } from "../controller/serviceController";

const router = Router({ mergeParams: true });

router.post("/", createService);
router.get("/", getServices);

export default router;