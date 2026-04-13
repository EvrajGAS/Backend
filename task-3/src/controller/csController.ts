import { Request, Response } from "express";
import { AppDataSource } from "../datasource/app";
import { Service } from "../entity/service";
import { Customer } from "../entity/customer";
import { CustomerService } from "../entity/CustomerService";

const customerRepo = AppDataSource.getRepository(Customer);
const serviceRepo = AppDataSource.getRepository(Service);
const csRepo = AppDataSource.getRepository(CustomerService);

export const assignService = async (req: Request, res: Response) => {
    const { id, serviceId } = req.params;

    const customer = await customerRepo.findOneBy({ id: Number(id) });
    const service = await serviceRepo.findOneBy({ id: Number(serviceId) });

    if (!customer || !service) {
        return res.status(404).json({ message: "Invalid Reques" });
    }

    const cs = csRepo.create({ customer, service });
    await csRepo.save(cs);

    res.json(cs);
}

export const getService = async (req: Request, res: Response) => {
    const cs = await csRepo.find({
        where: { customer: { id: Number(req.params.id) } },
        relations: ["service"]
    });

    res.json(cs);
}