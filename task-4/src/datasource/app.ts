import "reflect-metadata";
import { DataSource } from "typeorm";
import { Product } from "../entities/productEntity"
import { Variant } from "../entities/variantEntity"
import { SyncLog } from "../entities/syncEntity";
import * as dotenv from "dotenv"

dotenv.config()

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "Evraj",
    password: "12345",
    database: "postgres",
    entities: [Product, Variant, SyncLog],
    synchronize: true,
    logging: false,
})

