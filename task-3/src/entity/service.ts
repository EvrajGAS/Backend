import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";
import { Customer } from "./customer";
import { ServiceType } from "../types/enums"
@Entity()
export class Service {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({
        unique: true,
        type: "enum",
        enum: ServiceType
    })
    name!: ServiceType

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;

    @ManyToMany(() => Customer, (customer) => customer.services)
    customers!: Customer[];
}