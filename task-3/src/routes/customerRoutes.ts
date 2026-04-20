import Router from "koa-router";
import { createCustomer, getCustomers, getCustomerById, updateCustomer, deleteCustomer } from "../controller/customerController";


const router = new Router({
    prefix: "/customers",
});

router.post("/", createCustomer);
router.get("/", getCustomers);
router.get("/:id", getCustomerById);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);

export default router;