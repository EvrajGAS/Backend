import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { Account } from "./account";

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    type!: string

    @Column()
    amount!: number

    @Column()
    status!: string

    @CreateDateColumn()
    createdAt!: Date

    @ManyToOne(() => Account)
    account!: Account;
}