import { AppDataSource } from "../datasource/app";
import { Account } from "../entity/account";

export const accountRepo = AppDataSource.getRepository(Account);