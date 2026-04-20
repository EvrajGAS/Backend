import "reflect-metadata";
import { DataSource } from "typeorm";
import { Customer } from "../entity/customer";
import { Account } from "../entity/account";
import { KYC } from "../entity/kyc";
import { Transaction } from "../entity/transactions";
import { Loan } from "../entity/loan";
import { Service } from "../entity/service";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "evraj",
    password: "870009",
    database: "postgres",
    entities: [Customer, KYC, Account, Transaction, Loan, Service],
    synchronize: true,
})

