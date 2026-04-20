import { AppDataSource } from "../datasource/app";
import { Customer } from "../entity/customer";

export const customerRepo = AppDataSource.getRepository(Customer);