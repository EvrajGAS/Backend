import  { Router } from "@koa/router";
import { fetchProducts, syncProduct } from "../controllers/productController";

const router = new Router({
    prefix: "/api",
});

router.get("/fetch", fetchProducts);
router.get("/sync", syncProduct);

export default router;