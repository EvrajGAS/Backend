import { AppDataSource } from "../datasource/app";
import { Product } from "../entities/productEntity";

export const productRepo = AppDataSource.getRepository(Product);