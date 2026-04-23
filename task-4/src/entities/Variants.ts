import { Entity, PrimaryColumn, Column, ManyToOne } from "typeorm";
import { Product } from "./Products"

@Entity()
export class Variant {
    @PrimaryColumn()
    id!: string;

    @Column()
    title!: string;

    @Column({ nullable: true })
    inventoryPolicy!: string;

    @Column({ nullable: true })
    inventoryQuantity!: Number;

    @Column({ nullable: true })
    price!: string;

    @Column({ nullable: true })
    compareAtPrice!: string;

    @Column({ nullable: true })
    unitPrice!: string;

    @Column({ nullable: true })
    sku!: string;

    @Column({ type: "json", nullable: true })
    selectedOptions!: { name: string; value: string }[];

    @Column()
    createdAt!: Date;

    @ManyToOne(() => Product, (product) => product.variants, {
        onDelete: "CASCADE"
    })
    product!: Product
}
