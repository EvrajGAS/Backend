import { Entity, PrimaryGeneratedColumn, Column , ManyToOne} from "typeorm";
import { Customer } from "./customer";


@Entity()
export class Loan {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    amount!: number

    @Column()
    interestRate!: number

    @Column()
    status!: string

    @ManyToOne(() => Customer, (customer) => customer.loans)
    customer!: Customer;
}