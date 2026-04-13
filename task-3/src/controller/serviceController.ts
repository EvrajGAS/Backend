import { Request, Response } from "express";
import { AppDataSource } from "../datasource/app";
import { Service } from "../entity/service";

const serviceRepo = AppDataSource.getRepository(Service);

export const createService = async (req: Request, res: Response) => {
    const service = serviceRepo.create(req.body);

    await serviceRepo.save(service);
    res.json(service);
}

export const getServices = async (req: Request, res: Response) => {
    const services = await serviceRepo.find();
    res.json(services);
}



