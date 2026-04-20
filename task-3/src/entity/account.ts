import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne } from "typeorm";
import { Customer } from "./customer";
import { AccountType } from "../types/enums";

@Entity()
export class Account {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    accountNumber!: string

    @Column({
        type: "enum",
        enum: AccountType
    })
    type!: AccountType  //Savings Or Current

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;

    @Column({ default: 0 })
    balance!: number

    @ManyToOne(() => Customer, (customer) => customer.accounts)
    customer!: Customer;
}