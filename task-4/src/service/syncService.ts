import { Product } from "../entities/productEntity";
import { Variant } from "../entities/variantEntity";
import { SyncLog } from "../entities/syncEntity";
import { fetchUpdatedProducts, fetchProductsById } from "./shopifyService";
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
    const lastSyncTime = log.lastSyncTime ? new Date(log.lastSyncTime).toUTCString() : null;

    const shopifyID = await fetchProductsById();
    const dbProducts = await productRepo.find({
        select: ["id"]
    })

    const dbIds = dbProducts.map((p) => p.id);

    const deletedIds = dbIds.filter((id) => !shopifyID.includes(id));

    if (deletedIds.length) {
        await productRepo.delete(deletedIds);
        console.log(`Succesfully deleted ${deletedIds.length} Products`)
    }

    const updatedProducts = await fetchUpdatedProducts(lastSyncTime);

    if (updatedProducts.length === 0) {
        console.log("No updates");
        await updateSyncTime(new Date());
        return deletedIds.length;
    }

    let maxUpdatedAt: string | null = lastSyncTime;

    for (const p of updatedProducts) {
        const product = new Product();

        product.id = p.id;
        product.title = p.title;
        product.description = p.description;
        product.vendor = p.vendor;
        product.productType = p.category;
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

            return variant;
        });
        await variantRepo.save(variants);

        if(!maxUpdatedAt || p.updatedAt > maxUpdatedAt){
            maxUpdatedAt = p.updatedAt;
        }
    }

    if(maxUpdatedAt){
        await updateSyncTime(new Date(maxUpdatedAt));
    }else await  updateSyncTime(new Date());

    console.log(`Synced ${updatedProducts.length} Products`);

    return updatedProducts.length + deletedIds.length;
}
