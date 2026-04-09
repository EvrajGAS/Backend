import "reflect-metadata";

import { DataSource } from "typeorm";
import { User } from "../entity/user";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "evraj",
    password: "87009",
    database: "evraj",
    entities: [User],
    synchronize: true,
})

