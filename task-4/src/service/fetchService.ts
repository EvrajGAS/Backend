import { Product } from "../entities/productEntity";
import { Variant } from "../entities/variantEntity";
import { fetchAllProducts, fetchVariantsByProductId } from "./shopifyService";
import { productRepo } from "../repository/customerRepo";
import { variantRepo } from "../repository/VariantRepo";

export const fetchAndStoreProducts = async () => {
    let totalProducts = 0;
    let totalVariants = 0;
    let pHasNextPage = true;
    let pCursor: string | null = null;

    while (pHasNextPage) {
        const result = await fetchAllProducts(pCursor);
        if (!result) throw new Error('Failed to fetch products');

        const { products, hasNextPage: nextHasNextPage, cursor: nextCursor } = result;

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
        });


        await productRepo.save(mappedProducts);
        totalProducts += mappedProducts.length;

        pHasNextPage = nextHasNextPage;
        pCursor = nextCursor;
    }

    let vCursor: string | null = null;
    let vHasNextPage = true;

    while (vHasNextPage) {
        const result = await fetchVariantsByProductId(vCursor);
        if (!result) throw new Error('Failed to fetch variants');

        const { variants, hasNextPage: nextHasNextPage, cursor: nextCursor } = result;

        const mapped = variants.map((v: any) => {
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
        totalVariants += mapped.length
        vHasNextPage = nextHasNextPage;
        vCursor = nextCursor;
    }

    console.log(`Saved Products: ${totalProducts}`);
    console.log(`Saved Variants: ${totalVariants}`);
    return totalProducts + totalVariants;
}