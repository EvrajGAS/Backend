import { AppDataSource } from "../datasource/app";
import { SyncLog } from "../entities/syncEntity";

export const syncRepo = AppDataSource.getRepository(SyncLog);