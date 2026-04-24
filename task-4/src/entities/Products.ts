import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";
import { Variant } from "./Variants";
import { ProductStatus } from "../utils/Types";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id!: Number;

    @Column()
    shopifyId!: string;

    @Column()
    title!: string;

    @Column()
    vendor!: string;

    @Column()
    productType!: string;

    @Column()
    handle!: string;

    @Column({ type: "json", nullable: true })
    options!: { name: string; value: string }[];

    @Column({
        type: "enum",
        enum: ProductStatus,
        default: ProductStatus.DRAFT
    })
    status!: string;

    @Column({ type: "json", nullable: true })
    tags!: string[];

    @Column()
    variantsCount!: Number;

    @Column()
    productCreatedAt!: Date;

    @Column()
    productPublishedAt!: Date;

    @Column()
    productUpdatedAt!: Date;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;

    @OneToMany(() => Variant, variant => variant.product, {
        cascade: true,
    })
    variants!: Variant[];

}
