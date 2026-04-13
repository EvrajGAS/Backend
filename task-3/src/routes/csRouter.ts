import { Router } from "express";
import { assignService, getService } from "../controller/csController";

const router = Router({ mergeParams: true });

router.post("/customers/:id/services/:serviceId", assignService);
router.get("/customers/:id/services", getService);

export default router;