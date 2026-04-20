import { Entity, PrimaryColumn, Column , OneToMany } from "typeorm";
import { Variant } from "./variantEntity";

@Entity()
export class Product{
    @PrimaryColumn()
    id!: string;

    @Column()
    title!: string;

    @Column({nullable: true})
    description!: string;

    @Column({nullable: true})
    vendor!: string;

    @Column({nullable: true})
    productType!: string;

    @Column({nullable: true})
    publishedAt!: Date;

    @Column({nullable: true})
    updatedAt!: Date;

    @OneToMany(() => Variant, variant => variant.product,{
        cascade: true,
    })
    variants!: Variant[];

}
