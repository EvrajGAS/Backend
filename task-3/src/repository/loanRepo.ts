import { AppDataSource } from "../datasource/app";
import { Loan } from "../entity/loan";

export const loanRepo = AppDataSource.getRepository(Loan);