import Router from "@koa/router"; 
import { assignService, getCustomerServices } from "../controller/csController";

const router = new Router({
    prefix : "/customers/:id/services",
});

router.post("/:serviceId", assignService);
router.get("/", getCustomerServices);

export default router;