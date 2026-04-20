import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn , UpdateDateColumn , DeleteDateColumn,  OneToOne, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Account } from "./account";
import { KYC } from "./kyc";
import { Loan } from "./loan"
import { Service } from "./service";


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
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;

    @OneToOne(() => KYC, (kyc) => kyc.customer)
    kyc!: KYC;

    @OneToMany(() => Account, (account) => account.customer)
    accounts!: Account[];

    @OneToMany(() => Loan, (loan) => loan.customer)
    loans!: Loan[];

    @ManyToMany(() => Service, (service) => service.customers)
    @JoinTable()
    services!: Service[];
}