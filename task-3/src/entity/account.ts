import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn , ManyToOne} from "typeorm";
import { Customer } from "./customer";


@Entity()
export class Account {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    accountNumber!: string

    @Column()
    type!: string  //Savings Or Current

    @Column({ default: 0 })
    balance!: number

    @ManyToOne(() => Customer, (customer) => customer.accounts)
    customer!: Customer;
}