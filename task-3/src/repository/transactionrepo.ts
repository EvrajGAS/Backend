import { AppDataSource } from "../datasource/app";
import { Transaction } from "../entity/transactions";

export const transactionRepo = AppDataSource.getRepository(Transaction);