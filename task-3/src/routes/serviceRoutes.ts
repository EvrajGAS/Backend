import  Router  from "@koa/router";
import { createService, getServices } from "../controller/serviceController";

const router = new Router({ prefix: "/services" });

router.post("/", createService);
router.get("/", getServices);

export default router;