import { ProductRepository } from "../repository/ProductRepo";
import { VariantRepository } from "../repository/VariantRepo";
import { ClientRepository } from "../repository/ClientRepo";
import { ShopifyService } from "./ShopifyService";

export class SyncService {

    constructor(
        private productRepo: ProductRepository,
        private variantRepo: VariantRepository,
        private clientRepo: ClientRepository
    ) { }

    async run() {
        const client = await this.clientRepo.getClient();
        if (!client) throw new Error("Client not found");

        const shopify = new ShopifyService(client);

        await this.clientRepo.startSync(client);

        const lastSync = client.lastSyncEnd ? new Date(client.lastSyncEnd).toUTCString() : null;

        const startTime = new Date();
        console.log("Start Time: ", startTime);

        console.log("Deleting Products...");
        let dCursor: string | null = null;
        let dHasNextPage = true;
        let totalDeletedProducts = 0;


        while (dHasNextPage) {
            const { deleted, hasNextPage, endCursor } = await shopify.fetchDeleted(dCursor, lastSync);

            if (!deleted.length) break;

            await this.productRepo.deleteProducts(deleted.map((d: any) => d.id));

            totalDeletedProducts += deleted.length;
            dHasNextPage = hasNextPage;
            dCursor = endCursor;
        }

        if (totalDeletedProducts === 0) {
            console.log("0 Deleted Products")
        } else {
            console.log(`Deleted ${totalDeletedProducts} product`);
        }


        console.log("Fetching Products...");

        let pCursor: string | null = null;
        let pHasNextPage = true;
        let totalProductsCounts = 0;

        while (pHasNextPage) {
            const { products, hasNextPage, endCursor } = await shopify.fetchProducts(pCursor, lastSync);

            if (!products.length) break;

            await this.productRepo.saveProducts(products);

            totalProductsCounts += products.length;
            pHasNextPage = hasNextPage;
            pCursor = endCursor;
        }

        if (totalProductsCounts === 0) {
            console.log("0 Products Fetched")
        } else {
            console.log(`Fetched ${totalProductsCounts} Products`);
        }

        console.log("Fetching Variants...");
        let vCursor: string | null = null;
        let vHasNextPage = true;
        let totalVariantsCounts = 0;

        while (vHasNextPage) {
            const { variants, hasNextPage, endCursor } = await shopify.fetchVariants(vCursor, lastSync);

            if (!variants.length) break;

            await this.variantRepo.saveVariants(variants);

            totalVariantsCounts += variants.length;
            vHasNextPage = hasNextPage;
            vCursor = endCursor;
        }

        if (totalVariantsCounts === 0) {
            console.log("0 Variants Fetched")
        } else {
            console.log(`Fetched ${totalVariantsCounts} Variants`);
        }

        await this.clientRepo.endSync(client);

        const endTime = new Date();
        console.log("End Time: ", endTime);

        const totalDuration = (endTime.getTime() - startTime.getTime()) / 1000;
        console.log("Total Sync Time: ", totalDuration, "seconds");

        return {
            products: totalProductsCounts,
            variants: totalVariantsCounts,
            deleted: totalDeletedProducts
        };
    }
}
