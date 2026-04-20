import { Product } from "../entities/productEntity";
import { Variant } from "../entities/variantEntity";
import { fetchAllProducts } from "./shopifyService";
import { productRepo } from "../repository/customerRepo";

export const fetchAndStoreProducts = async () => {
    const products: any = await fetchAllProducts();

    const formattedProducts: Product[] = [];

    for (const p of products) {
        const product = new Product();

        product.id = p.id;
        product.title = p.title;
        product.description = p.description;
        product.vendor = p.vendor;
        product.productType = p.category;
        product.publishedAt = p.publishedAt;
        product.updatedAt = p.updated_at;

        product.variants = p.variants.edges.map((v: any) => {
            const variant = new Variant();

            variant.id = v.node.id;
            variant.title = v.node.title;
            variant.displayName = v.node.displayName;
            variant.price = v.node.price;
            variant.sku = v.node.sku;
            variant.createdAt = v.node.createdAt;

            return variant;
        });
        formattedProducts.push(product);
    }
    await productRepo.save(formattedProducts);

    return formattedProducts.length;
}