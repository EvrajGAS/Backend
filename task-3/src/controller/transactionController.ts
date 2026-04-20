import { Context } from "koa";
import { transactionRepo } from "../repository/transactionrepo";
import { accountRepo } from "../repository/accountRepo";
import { TransactionType, TransactionStatus } from "../types/enums";
import { CreateTransaction } from "../types/interfaces";

export const createTransaction = async (ctx: Context) => {
    const { accountId, type, amount } = ctx.request.body as CreateTransaction;
    const account = await accountRepo.findOneBy({ id: accountId }) as any;

    if (!account) {
        ctx.status = 404;
        ctx.body = { message: "Account not found!" };
    }

    if (type === TransactionType.DEBIT && account.balance < amount) {
        ctx.status = 400;
        ctx.body = { message: "Insufficient Balance" };
        return;
    }

    if (type === TransactionType.DEBIT) account.balance -= amount;
    else account.balance += amount;

    await accountRepo.save(account);

    const transaction = transactionRepo.create({
        type, amount, status: TransactionStatus.SUCCESS, account
    })

    await transactionRepo.save(transaction);
    ctx.status = 201;
    ctx.body = transaction
}

export const getTransactionbyID = async (ctx: Context) => {
    const transactions = await transactionRepo.find({
        where: { account: { id: Number(ctx.params.id) } }
    });

    if (transactions.length === 0) {
        ctx.status = 404;
        ctx.body = { message: "No transactions found" };
    }

    ctx.body = transactions;
}