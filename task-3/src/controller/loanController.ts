import { Request, Response } from "express";
import { AppDataSource } from "../datasource/app";
import { Customer } from "../entity/customer";
import { Loan } from "../entity/loan";

const customerRepo = AppDataSource.getRepository(Customer);
const loanRepo = AppDataSource.getRepository(Loan);

export const newLoan = async (req: Request, res: Response) => {
    const { customerId, amount, interestRate } = req.body;

    const customer = await customerRepo.findOneBy({ id: customerId });
    if (!customer) return res.json({ message: "Customer not found" });

    const loan = loanRepo.create({
        amount, interestRate, status: "PENDING", customer
    });

    await loanRepo.save(loan);

    res.json(loan);
};

//getLoan by Customer ID
export const getLoan = async (req: Request, res: Response) => {
    const loan = await loanRepo.find({
        where: { customer: { id: Number(req.params.id) } }
    });

    if (loan.length === 0) res.status(404).json({ message: "No Loan Found" })

    res.json(loan);
}

//updateStatus
export const updateStatus = async (req: Request, res: Response) => {
    const loan = await loanRepo.findOneBy({ id: Number(req.params.id) });

    if (!loan) return res.status(404).json({ message: "No loan found" });

    loan.status = req.body.status;
    await loanRepo.save(loan);

    res.json(loan);
}