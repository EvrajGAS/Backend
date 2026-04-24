import { Repository } from "typeorm";
import { Variant } from "../entities/Variants";
import { Product } from "../entities/Products";

export class VariantRepository {
    constructor(private repo: Repository<Variant>) { }

    async saveVariants(variants: any) {
        const mappedVariant = variants.map((v: any) => {
            if (!v.product?.id) return null;

            const variant = new Variant();

            variant.shopifyId = v.id;
            variant.title = v.title;
            variant.inventoryPolicy = v.inventoryPolicy;
            variant.inventoryQuantity = v.inventoryQuantity ?? 0;
            variant.price = v.price;
            variant.compareAtPrice = v.compareAtPrice;
            variant.unitPrice = v.unitPrice;
            variant.sku = v.sku;
            variant.selectedOptions = v.selectedOptions;
            variant.variantCreatedAt = v.createdAt;

            variant.product = v.product;

            return variant;
        });
        return this.repo.save(mappedVariant);
    }
}