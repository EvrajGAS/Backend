import { Context } from "koa";
import { syncUpdatedProducts } from "../service/syncService";
import { fetchAndStoreProducts } from "../service/fetchService";

export const fetchProducts = async (ctx: Context) => {
    try {
       const count = await fetchAndStoreProducts();

       ctx.body ={
        message: "Fetch and store products on db succesfully",
        total: count,
        }
    } catch (err) {
        console.log(err);
        ctx.status = 500;
        ctx.body = { error: "Fetch Failed" };
    }
};

export const syncProduct = async (ctx:Context) => {
    try{
        const count = await syncUpdatedProducts();

        ctx.body ={
        message: "Sync succesfully",
        total: count,
        }
    }catch(err) {
        console.log(err);
        ctx.status = 500;
        ctx.body = { error: "Sync Failed" };
    }
}

