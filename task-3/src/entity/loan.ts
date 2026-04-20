import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn} from "typeorm";
import { Customer } from "./customer";
import { LoanStatus } from "../types/enums";

@Entity()
export class Loan {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    amount!: number

    @Column()
    interestRate!: number

    @Column({
        type: "enum",
        enum: LoanStatus
    })
    status!: LoanStatus

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;

    @ManyToOne(() => Customer, (customer) => customer.loans)
    customer!: Customer;
}