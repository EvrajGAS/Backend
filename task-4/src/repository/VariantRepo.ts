import  { AppDataSource } from "../datasource/app";
import { Variant } from "../entities/variantEntity";

export const variantRepo = AppDataSource.getRepository(Variant);