import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { CustomerService } from "./CustomerService";

@Entity()
export class Service {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ unique: true })
    name!: string

    @OneToMany(() => CustomerService, (cs) => cs.service)
    customers!: CustomerService[];
}