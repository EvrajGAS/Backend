import { Repository } from "typeorm";
import { Product } from "../entities/Products";

export class ProductRepository {
    constructor(private repo: Repository<Product>) { }

    async saveProducts(products: any) {
        const mappedProduct = products.map((p: any) => {
            const product = new Product();

            product.id = p.id;
            product.title = p.title;
            product.vendor = p.vendor;
            product.productType = p.productType;
            product.handle = p.handle;
            product.options = p.options || [];;
            product.status = p.status;
            product.tags = p.tags;
            product.variantsCount = p.variantsCount?.count ?? 0;
            product.createdAt = p.createdAt;
            product.publishedAt = p.publishedAt;
            product.updatedAt = p.updatedAt;

            return product;
        });
        return this.repo.save(mappedProduct);
    }

    async deleteProducts(ids: string[]) {
        if (!ids.length) return;

        return this.repo.delete(ids);
    }
}
