import { Request, Response } from "express";
import { AppDataSource } from "../datasource/app";
import { Customer } from "../entity/customer";
import { Account } from "../entity/account";
import { validateAccount } from "../utils/validateAccount";
import { DeleteResult } from "typeorm";

const customerRepo = AppDataSource.getRepository(Customer);
const accountRepo = AppDataSource.getRepository(Account);

export const createAccount = async (req: Request, res: Response) => {
    const errors = validateAccount(req.body);

    if (errors.length > 0) return res.status(404).json({ errors })


    const { customerId, accountNumber, type } = req.body;

    const customer = await customerRepo.findOneBy({ id: customerId });

    if (!customer) return res.status(404).json({ message: "Customer not found!" });

    const account = accountRepo.create({ accountNumber, type, customer });
    await accountRepo.save(account);

    res.status(201).json(account);
}

//getAccounts

export const getAccounts = async (req: Request, res: Response) => {
    const accounts = await accountRepo.find({ relations: ["customer"] });
    res.json(accounts);
}

//getAccountbyID

export const getAccountbyID = async (req: Request, res: Response) => {
    const findAccountbyId = Number(req.params.id);

    if (findAccountbyId) {
        const account = await accountRepo.findOne({
            where: { id: findAccountbyId },
            relations: ["customer"]
        });

        if (account) res.json(account);
        else res.status(404).json({ message: "Account not found" });
    }
    else res.status(404).json({ message: "Account not found" });
}

//DeleteACcount
export const deleteAccount = async (req: Request, res: Response) => {
    const findAccountbyId = Number(req.params.id);

    if (findAccountbyId) {
        const deleteAccount = await accountRepo.delete(findAccountbyId);

        if (deleteAccount.affected !== 0) res.json({ message: "Account Deleted" });
        else res.status(404).json({ message: "Account not found" });
    }
    else res.status(404).json({ message: "Account not found" });
}