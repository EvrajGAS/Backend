import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";
import { Product } from "./Products"
import { InventoryPolicies } from "../utils/Types";

@Entity()
export class Variant {
    @PrimaryGeneratedColumn()
    id!: Number;

    @Column()
    shopifyId!: string;

    @Column()
    title!: string;

    @Column({
        type: "enum",
        enum: InventoryPolicies,
    })
    inventoryPolicy!: string;

    @Column()
    inventoryQuantity!: Number;

    @Column()
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
    variantCreatedAt!: Date;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;

    @ManyToOne(() => Product, (product) => product.variants, {
        onDelete: "CASCADE"
    })
    product!: Product
}
