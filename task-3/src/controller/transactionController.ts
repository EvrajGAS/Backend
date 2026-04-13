import { Request, Response } from "express";
import { AppDataSource } from "../datasource/app";
import { Transaction } from "../entity/transactions";
import { Account } from "../entity/account";
import { error } from "node:console";

const accountRepo = AppDataSource.getRepository(Account);
const transactionRepo = AppDataSource.getRepository(Transaction);

export const createTransaction = async (req: Request, res: Response) => {
    const { accountId, type, amount } = req.body;
    const account = await accountRepo.findOneBy({ id: accountId });

    if (!account) return res.json({ message: "Account not found!" });

    if (type.toLowerCase() === "debit" && account.balance < amount) return res.json({ message: "Insufficient Balance" });

    if (type.toLowerCase() === "debit") account.balance -= amount;
    else account.balance += amount;

    await accountRepo.save(account);

    const transaction = transactionRepo.create({
        type, amount, status: "Success", account
    })

    await transactionRepo.save(transaction);
    res.status(201).json(transaction);
}

export const getTransactionbyID = async (req: Request, res: Response) => {
    const transactions = await transactionRepo.find({
        where: { account: { id: Number(req.params.id) } }
    });

    if (transactions.length === 0) return res.status(404).json({ message: "no transaction found" })

    res.json(transactions);
}