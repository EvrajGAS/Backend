import { AppDataSource } from "../datasource/app";
import { KYC } from "../entity/kyc";

export const kycRepo = AppDataSource.getRepository(KYC);