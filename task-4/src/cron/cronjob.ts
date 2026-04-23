import cron from "node-cron";
import { SyncService } from "../service/ProductService";
import { AppDataSource } from "../datasource/app";

import { Client } from "../entities/Client";
import { Product } from "../entities/Products";
import { Variant } from "../entities/Variants";

import { ProductRepository } from "../repository/ProductRepo";
import { ClientRepository } from "../repository/ClientRepo";
import { VariantRepository } from "../repository/VariantRepo";

export const startCron = () => {
    const productRepo = new ProductRepository(AppDataSource.getRepository(Product));
    const variantRepo = new VariantRepository(AppDataSource.getRepository(Variant));
    const clientRepo = new ClientRepository(AppDataSource.getRepository(Client));

    const syncService = new SyncService(productRepo, variantRepo, clientRepo);

    const job = cron.schedule("* * * * *", async () => {

        console.log("Running CRON job...");

        try {
            const result = await syncService.run();
            if (result.products === 0) {
                console.log("No Products Fetched");
            } else {
                console.log(`synced  ${result.products} products succesfully and stored on database`);
            }

            if (result.variants === 0) {
                console.log("No Variants Fetched");
            } else {
                console.log(`synced  ${result.variants} variants succesfully and stored on database`);
            }

            if (result.deleted === 0) {
                console.log("No Products Deleted");
            } else {
                console.log(`Deleted ${result.deleted} products succesfully and removed from database`);
            }
        } catch (err) {
            console.log("error", err);
        }finally{
            console.log("Job Completed");
        }
    },
        {
            timezone: "Asia/Kolkata",
        }
    )
    return job;
};