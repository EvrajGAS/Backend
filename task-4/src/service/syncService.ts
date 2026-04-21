import { Product } from "../entities/productEntity";
import { Variant } from "../entities/variantEntity";
import { SyncLog } from "../entities/syncEntity";
import { fetchUpdatedProducts, fetchDeletedProducts } from "./shopifyService";
import { productRepo } from "../repository/customerRepo";
import { variantRepo } from "../repository/VariantRepo";
import { syncRepo } from "../repository/syncRepo";

const getLastSync = async () => {
    let log = await syncRepo.findOne({ where: {} });

    if (!log) {
        log = new SyncLog();
        log.lastSyncTime = null;
        await syncRepo.save(log);
    }
    return log;
}

const updateSyncTime = async (time: Date) => {
    const log = await syncRepo.findOne({ where: {} });

    if (log) {
        log.lastSyncTime = time;
        await syncRepo.save(log);
    }
}

export const syncUpdatedProducts = async () => {
    const log = await getLastSync();
    const lastSyncTime = log.lastSyncTime
        ? new Date(log.lastSyncTime).toISOString()
        : null;

    const deletedProducts = await fetchDeletedProducts(lastSyncTime);
    let lastDeleteTime: string | null = lastSyncTime;

    if (deletedProducts.length) {
        const deletedIds = deletedProducts.map(d => d.id)
        await productRepo.delete(deletedIds);
        console.log(`Succesfully deleted ${deletedProducts.length} Products`)

        for (const d of deletedProducts) {
            if (!lastDeleteTime || new Date(d.time) > new Date(lastDeleteTime)) {
                lastDeleteTime = d.time;
            }
        }
    }

    let hasNextPage = true;
    let cursor: string | null = null;

    let totalUpdated = 0;
    let maxUpdatedAt: string | null = lastSyncTime;

    while (hasNextPage) {
        const { products, hasNextPage: nextPage, cursor: nextCursor } =
            await fetchUpdatedProducts(cursor, lastSyncTime);

        if (!products.length) break;

        for (const p of products) {

            const product = new Product();

            product.id = p.id;
            product.title = p.title;
            product.description = p.description;
            product.vendor = p.vendor;
            product.productType = p.productType;
            product.publishedAt = p.publishedAt;
            product.updatedAt = p.updatedAt;

            await productRepo.save(product);

            const variants = p.variants.edges.map((v: any) => {
                const variant = new Variant();

                variant.id = v.node.id;
                variant.title = v.node.title;
                variant.displayName = v.node.displayName;
                variant.price = v.node.price;
                variant.sku = v.node.sku;
                variant.createdAt = v.node.createdAt;
                variant.product = product;

                return variant;
            });

            await variantRepo.save(variants);

            if (!maxUpdatedAt || new Date(p.updatedAt) > new Date(maxUpdatedAt)) {
                maxUpdatedAt = p.updatedAt;
            }

            totalUpdated++;
        }

        hasNextPage = nextPage;
        cursor = nextCursor;
    }

    let finalTime: string | null = null;

    if (maxUpdatedAt && lastDeleteTime) {
        finalTime = new Date(maxUpdatedAt) > new Date(lastDeleteTime) ? maxUpdatedAt : lastDeleteTime;
    } else {
        finalTime = maxUpdatedAt || lastDeleteTime;
    }

    if (finalTime) {
        const nextTime = new Date(finalTime);

        nextTime.setMilliseconds(nextTime.getMilliseconds() + 1);
        await updateSyncTime(nextTime);
    } else await updateSyncTime(new Date());


    console.log(`Updated ${totalUpdated} products and Deleted ${deletedProducts.length} products`);

    return totalUpdated + deletedProducts.length;
};