import { Product } from "../entities/productEntity";
import { Variant } from "../entities/variantEntity";
import { SyncLog } from "../entities/syncEntity";
import { fetchUpdatedProducts, fetchDeletedProducts, fetchUpdatedVariants } from "./shopifyService";
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

    let pHasNextPage = true;
    let pCursor: string | null = null;

    let totalUpdatedProducts = 0;
    let maxUpdatedAt: string | null = lastSyncTime;

    while (pHasNextPage) {
        const result = await fetchUpdatedProducts(pCursor, lastSyncTime);
        if (!result) {
            throw new Error('Failed to update Products');
        }

        const { products, hasNextPage: nextHasNextPage, cursor: nextCursor } = result;
        if (!products.length) break;

        const mappedProducts = products.map((p: any) => {
            const product = new Product();

            product.id = p.id;
            product.title = p.title;
            product.description = p.description;
            product.vendor = p.vendor;
            product.productType = p.productType;
            product.publishedAt = p.publishedAt;
            product.updatedAt = p.updatedAt;

            return product;
        })

        await productRepo.save(mappedProducts);
        totalUpdatedProducts += mappedProducts.length;

        for (const p of products) {
            if (!maxUpdatedAt || new Date(p.updatedAt) > new Date(maxUpdatedAt)) {
                maxUpdatedAt = p.updatedAt;
            }
        }

        pHasNextPage = nextHasNextPage;
        pCursor = nextCursor;
    }

    let vHasNextPage = true;
    let vCursor: string | null = null;

    let totalUpdatedVariants = 0;
    let maxVariantUpdatedAt: string | null = lastSyncTime;

    while (vHasNextPage) {
        const result = await fetchUpdatedVariants(vCursor, lastSyncTime);
        if (!result) {
            throw new Error('Failed to Update Variants');
        }

        const { variants, hasNextPage: nextHasNextPage, cursor: nextCursor } = result;
        if (!variants.length) break;

        const mapped = variants.map((v: any) => {
            if (!v.product) return null;
            const variant = new Variant();

            variant.id = v.id;
            variant.title = v.title;
            variant.displayName = v.displayName;
            variant.price = v.price;
            variant.sku = v.sku;
            variant.createdAt = v.createdAt;
            variant.product = { id: v.product.id } as Product;

            return variant;
        });

        await variantRepo.save(mapped);
        totalUpdatedVariants += mapped.length;

        for (const v of variants) {
            if (!maxVariantUpdatedAt || new Date(v.updatedAt) > new Date(maxVariantUpdatedAt)) {
                maxVariantUpdatedAt = v.updatedAt;
            }
        }

        vHasNextPage = nextHasNextPage;
        vCursor = nextCursor;
    }


    let finalTime: string | null = null;
    const allTimes = [maxUpdatedAt, maxVariantUpdatedAt, lastDeleteTime];

    if (allTimes.length) {
        finalTime = allTimes.reduce((a, b) =>
            new Date(a!) > new Date(b!) ? a : b
        );
    }

    if (finalTime) {
        const nextTime = new Date(finalTime);
        nextTime.setMilliseconds(nextTime.getMilliseconds() + 1);
        await updateSyncTime(nextTime);
    } else await updateSyncTime(new Date());


    console.log(`Updated ${totalUpdatedProducts} Products, Updated ${totalUpdatedVariants} Variants and Deleted ${deletedProducts.length} products`);

    return totalUpdatedProducts + totalUpdatedVariants + deletedProducts.length;
};