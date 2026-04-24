import { ProductRepository } from "../repository/ProductRepo";
import { VariantRepository } from "../repository/VariantRepo";
import { ClientRepository } from "../repository/ClientRepo";
import { ShopifyService } from "./ShopifyService";
import { In } from "typeorm";
import { Product } from "../entities/Products";

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

        await this.clientRepo.fetchStartTime(client);

        const lastSync = client.lastSyncEnd ? new Date(client.lastSyncEnd).toUTCString() : null;

        const startTime = new Date();
        console.log("Start Time: ", startTime);

        console.log("Started Deleting Products...");
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

        console.log("Completed Products Deletion")

        console.log("Started Fetching Products...");

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

        console.log("Completed Fetching Products");


        console.log("Started Fetching Variants...");
        let vCursor: string | null = null;
        let vHasNextPage = true;
        let totalVariantsCounts = 0;

        while (vHasNextPage) {
            const { variants, hasNextPage, endCursor } = await shopify.fetchVariants(vCursor, lastSync);

            if (!variants.length) break;

            const productShopifyIds = variants.map((v:any) => v.product.id);

            const products = await this.productRepo.getProductsByShopifyIds(productShopifyIds);

            const mappedProducts = new Map(
                products.map(p => [p.shopifyId, p.id])
            );

            const finalVariants = variants.map((v:any) => {
                const productId = mappedProducts.get(v.product.id);

                if(!productId) return null;

                return {
                    ...v, 
                    product: {id: productId}
                }
            })

            await this.variantRepo.saveVariants(finalVariants);

            totalVariantsCounts += finalVariants.length;
            vHasNextPage = hasNextPage;
            vCursor = endCursor;
        }

        console.log("Completed Fetching Variants")


        await this.clientRepo.fetchEndTime(client);

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
