import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne } from "typeorm";
import { Account } from "./account";
import { TransactionStatus, TransactionType } from "../types/enums";

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({
        type: "enum",
        enum: TransactionType
    })
    type!: TransactionType

    @Column()
    amount!: number

    @Column({
        type: "enum",
        enum: TransactionStatus
    })
    status!: TransactionStatus

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;

    @ManyToOne(() => Account)
    account!: Account;
}