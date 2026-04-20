import { Context } from "koa";
import { customerRepo } from "../repository/customerRepo";
import { accountRepo } from "../repository/accountRepo";
import { validateAccount } from "../utils/validateAccount";
import { CreateAccount } from "../types/interfaces";

export const createAccount = async (ctx: Context) => {
    const body = ctx.request.body as CreateAccount;
    const errors = validateAccount(body);

    if (errors.length > 0) {
        ctx.status = 404;
        ctx.body = errors;
        return;
    }

    const { customerId, accountNumber, type } = body;

    const customer = await customerRepo.findOneBy({ id: customerId });
    if (!customer) {
        ctx.status = 404;
        ctx.body = { message: "Customer not found!" };
        return;
    }

    const account = accountRepo.create({ accountNumber, type, customer });
    await accountRepo.save(account);

    ctx.status = 201;
    ctx.body = account
}

//getAccounts
export const getAccounts = async (ctx: Context) => {
    const accounts = await accountRepo.find({ relations: ["customer"] });
    ctx.body = accounts;
}

//getAccountbyID
export const getAccountbyID = async (ctx: Context) => {
    const findAccountbyId = Number(ctx.params.id);

    if (findAccountbyId) {
        const account = await accountRepo.findOne({
            where: { id: findAccountbyId },
            relations: ["customer"]
        });

        if (account) ctx.body = account;
        else {
            ctx.status = 404;
            ctx.body = { message: "Account not found" }
        }
    }
    else {
        ctx.status = 404;
        ctx.body = { message: "Account not found" }
    }
}

//DeleteACcount
export const deleteAccount = async (ctx: Context) => {
    const findAccountbyId = Number(ctx.params.id);

    if (findAccountbyId) {
        const deleteAccount = await accountRepo.softDelete(findAccountbyId);

        if (deleteAccount.affected !== 0) ctx.body = { message: "Account Deleted" };
        else {
            ctx.status = 404;
            ctx.body = { message: "Account not found" };
        }
    }
    else {
        ctx.status = 404;
        ctx.body = { message: "Account not found" };
    }
}