import cron from "node-cron";
import { AppDataSource } from "../datasource/app";

import { Client } from "../entities/Client";
import { Product } from "../entities/Products";
import { Variant } from "../entities/Variants";

import { ProductRepository } from "../repository/ProductRepo";
import { ClientRepository } from "../repository/ClientRepo";
import { VariantRepository } from "../repository/VariantRepo";

import { SyncService } from "../service/FetchProducts";


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
                console.log(`Succesfully synced ${result.products} products and stored on database`);
            }

            if (result.variants === 0) {
                console.log("No Variants Fetched");
            } else {
                console.log(`Succesfully synced  ${result.variants} variants and stored on database`);
            }

            if (result.deleted === 0) {
                console.log("No Products Deleted");
            } else {
                console.log(`Succesfully Deleted ${result.deleted} products and removed from database`);
            }
        } catch (err) {
            console.log("error", err);
        } finally {
            console.log("Job Completed");
        }
    },
        {
            timezone: "Asia/Kolkata",
        }
    )
    return job;
};