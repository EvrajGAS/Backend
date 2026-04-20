import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";
import { Customer } from "./customer";

@Entity()
export class KYC {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ unique: true })
    aadharNumber!: string

    @Column({ unique: true })
    panNumber!: string

    @Column()
    address!: string

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;

    @OneToOne(() => Customer, (customer) => customer.kyc)
    @JoinColumn()
    customer!: Customer

}