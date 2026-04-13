import { Request, Response } from "express";
import { AppDataSource } from "../datasource/app";
import { Customer } from "../entity/customer";
import { KYC } from "../entity/kyc";
import { validateKYC } from "../utils/validateKYC";

const customerRepo = AppDataSource.getRepository(Customer);
const kycRepo = AppDataSource.getRepository(KYC);

export const createKYC = async (req: Request, res: Response) => {
    const errors = validateKYC(req.body);

    if (errors.length > 0) return res.status(404).json({ errors });

    const customerId = Number(req.params.id)
    if (customerId) {
        const customer = await customerRepo.findOne({
            where: { id: customerId },
            relations: ["kyc"],
        });

        if (!customer) return res.status(404).json({ mesaage: "Customer not found" });
        else if (customer.kyc) return res.status(404).json({ mesaage: "KYC aready exists!" });

        const kyc = kycRepo.create({ ...req.body, customer });

        await kycRepo.save(kyc);
        res.status(201).json(kyc);
    } else {
        return res.status(404).json({ mesaage: "Customer not found" });
    }
}

//getKYC
export const getKYC = async (req: Request, res: Response) => {
    const customerId = Number(req.params.id)

    if (customerId) {
        const kyc = await kycRepo.findOne({
            where: { customer: { id: customerId } }
        });

        if (kyc) res.json(kyc);
        else res.status(404).json({ mesaage: "KYC not found" });
    }
    else return res.status(404).json({ mesaage: "KYC not found" });
}

//UpdateKYC
export const updateKYC = async (req: Request, res: Response) => {
    const kyc = await kycRepo.findOne({
        where: { customer: { id: Number(req.params.id) } }
    });

    if (!kyc) {
        return res.status(404).json({ mesaage: "KYC not found" });
    }

    kycRepo.merge(kyc, req.body);
    await kycRepo.save(kyc);

    res.json(kyc);
}

