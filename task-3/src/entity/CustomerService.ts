import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Customer } from "./customer";
import { Service } from "./service";

@Entity()
export class CustomerService {
    @PrimaryGeneratedColumn()
    id!: number

    @ManyToOne(() => Customer, (customer) => customer.services)
    customer!: Customer;

    @ManyToOne(() => Service, (service) => service.customers)
    service!: Service;

}