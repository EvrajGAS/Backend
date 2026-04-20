import cron from "node-cron";
import { syncUpdatedProducts } from "../service/syncService";

let isRunning = false;

export const startCron = () => {
    const job =  cron.schedule("0 */6 * * *", async () => {
        if (isRunning) {
            console.log("previous sync still running");
            return;
        }

        isRunning = true;
        console.log("Running CRON job...");

        try {
            const count = await syncUpdatedProducts();
            console.log(`synced succesfully ${count} products`);
        } catch (err) {
            console.log("error", err);
        } finally {
            isRunning = false;
        }
    },
        {
            timezone: "Asia/Kolkata",
        }
    )
    return job;
};