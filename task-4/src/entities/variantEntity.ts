import { Entity, PrimaryColumn, Column , ManyToOne } from "typeorm";
import { Product } from "./productEntity"

@Entity()
export class Variant{
    @PrimaryColumn()
    id!: string;

    @Column()
    title!: string;

    @Column({nullable: true})
    displayName!: string;

    @Column({nullable: true})
    price!: string;

    @Column({nullable: true})
    sku!: string;

    @Column()
    createdAt!: Date;

    @ManyToOne(() => Product, (product) => product.variants,{
        onDelete: "CASCADE"
    })
    product!: Product
}
