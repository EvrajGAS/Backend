import "reflect-metadata";
import { DataSource } from "typeorm";
import { Product } from "../entities/Products"
import { Variant } from "../entities/Variants"
import { Client } from "../entities/Client";
import * as dotenv from "dotenv"

dotenv.config()

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "evraj",
    password: "54321",
    database: "postgres",
    entities: [Product, Variant, Client],
    synchronize: true,
    logging: false,
})

