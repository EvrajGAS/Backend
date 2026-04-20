import { AppDataSource } from "../datasource/app";
import { Service } from "../entity/service";

export const serviceRepo = AppDataSource.getRepository(Service);