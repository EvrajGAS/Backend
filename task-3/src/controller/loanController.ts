import { Context } from "koa";
import { customerRepo } from "../repository/customerRepo";
import { loanRepo } from "../repository/loanRepo";
import { CreateLoan } from "../types/interfaces";
import { LoanStatus } from "../types/enums";

export const newLoan = async (ctx: Context) => {
    const body = ctx.request.body as CreateLoan;
    const { customerId, amount, interestRate } = body;

    const customer = await customerRepo.findOneBy({ id: customerId });
    if (!customer) {
        ctx.status = 404;
        ctx.body = { message: "Customer not found" };
        return;
    }

    const loan = loanRepo.create({
        amount: Number(amount),
        interestRate: Number(interestRate),
        status: LoanStatus.PENDING,
        customer: customer
    });

    await loanRepo.save(loan);
    ctx.body = loan;
};

//getLoan by Customer ID
export const getLoan = async (ctx: Context) => {
    const loan = await loanRepo.find({
        where: { customer: { id: Number(ctx.params.id) } },
        relations: ["customer"]
    });

    if (loan.length === 0) {
        ctx.status = 404;
        ctx.body = { message: "NO Loan found" };
        return;
    }

    ctx.body = loan;
}

//updateStatus
export const updateStatus = async (ctx: Context) => {
    const loan = await loanRepo.findOneBy({ id: Number(ctx.params.id) });

    if (!loan) {
        ctx.status = 404;
        ctx.body = { message: "NO Loan found" };
        return;
    }

    const body = ctx.request.body as any;
    loan.status = body.status;
    await loanRepo.save(loan);

    ctx.body = loan;
}