import { Repository, In } from "typeorm";
import { Product } from "../entities/Products";

export class ProductRepository {
    constructor(private repo: Repository<Product>) { }

    async saveProducts(products: any) {
        const mappedProduct = products.map((p: any) => {
            const product = new Product();

            product.shopifyId = p.id;
            product.title = p.title;
            product.vendor = p.vendor;
            product.productType = p.productType;
            product.handle = p.handle;
            product.options = p.options || [];;
            product.status = p.status;
            product.tags = p.tags ?? [];
            product.variantsCount = p.variantsCount?.count ?? 0;
            product.productCreatedAt = p.createdAt;
            product.productPublishedAt = p.publishedAt;
            product.productUpdatedAt = p.updatedAt;

            return product;
        });
        return this.repo.save(mappedProduct);
    }

    async deleteProducts(shopifyIds: string[]) {
        if (!shopifyIds.length) return;

        return this.repo.softDelete({ shopifyId: In(shopifyIds) });
    }

    async getProductsByShopifyIds(shopifyIds: string[]){
        if(!shopifyIds.length) return [];

        return this.repo.find({
            select: ["id", "shopifyId"],
            where:{
                shopifyId: In(shopifyIds)
            }
        });
    }
}
