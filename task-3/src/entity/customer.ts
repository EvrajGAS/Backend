import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, OneToMany } from "typeorm";
import { Account } from "./account";
import { KYC } from "./kyc";
import { Loan } from "./loan"
import { CustomerService } from "./CustomerService";


@Entity()
export class Customer {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column({ unique: true })
    email!: string

    @Column({ unique: true })
    phone!: string

    @CreateDateColumn()
    createdAt!: Date

    @OneToOne(() => KYC, (kyc) => kyc.customer)
    kyc!: KYC;

    @OneToMany(() => Account, (account) => account.customer)
    accounts!: Account[];

    @OneToMany(() => Loan, (loan) => loan.customer)
    loans!: Loan[];

    @OneToMany(() => CustomerService, (cs) => cs.customer)
    services!: CustomerService[];
}