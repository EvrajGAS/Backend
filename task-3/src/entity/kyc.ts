import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from "typeorm";
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

    @OneToOne(() => Customer, (customer) => customer.kyc)
    @JoinColumn()
    customer!: Customer

}