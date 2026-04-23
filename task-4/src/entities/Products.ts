import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { Variant } from "./Variants";

@Entity()
export class Product {
    @PrimaryColumn()
    id!: string;

    @Column()
    title!: string;

    @Column({ nullable: true })
    vendor!: string;

    @Column({ nullable: true })
    productType!: string;

    @Column({ nullable: true })
    handle!: string;

    @Column({ type: "json", nullable: true })
    options!: { name: string; value: string }[];

    @Column({ nullable: true })
    status!: string;

    @Column({ nullable: true })
    tags!: string;

    @Column({ nullable: true })
    variantsCount!: Number;

    @Column({ nullable: true })
    createdAt!: Date;

    @Column({ nullable: true })
    publishedAt!: Date;

    @Column({ nullable: true })
    updatedAt!: Date;

    @OneToMany(() => Variant, variant => variant.product, {
        cascade: true,
    })
    variants!: Variant[];

}
