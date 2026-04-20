import { Context } from "koa";
import { customerRepo } from "../repository/customerRepo";
import { validateCustomer } from "../utils/validateCustomer"
import { CreateCustomer } from "../types/interfaces";

//createCustomer
export const createCustomer = async (ctx: Context) => {
    const body = ctx.request.body as CreateCustomer;

    const errors = validateCustomer(body);

    if (errors.length > 0) {
        ctx.status = 404;
        ctx.body = errors;
        return;
    }

    const customer = customerRepo.create(body);
    const result = await customerRepo.save(customer);

    ctx.body = result;
}

//getCustomers
export const getCustomers = async (ctx: Context) => {
    const customers = await customerRepo.find();
    ctx.body = customers;
}


//getCustomerById
export const getCustomerById = async (ctx: Context) => {
    const findCustomerId = Number(ctx.params.id);

    if (findCustomerId) {
        const customer = await customerRepo.findOneBy({
            id: findCustomerId
        });

        if (customer) ctx.body = customer;
        else {
            ctx.status = 404;
            ctx.body = { message: "Customer not found" };
        }
    } else {
        ctx.status = 404;
        ctx.body = { message: "Customer not found" };
    }
}


//updateCustomer
export const updateCustomer = async (ctx: Context) => {
    const body = ctx.request.body as CreateCustomer;

    const errors = validateCustomer(body);

    if (errors.length > 0) {
        return ctx.body = errors;
    }

    const findCustomer = Number(ctx.params.id);

    if (findCustomer) {
        const customerExist = await customerRepo.findOneBy({
            id: findCustomer
        });

        if (customerExist) {
            await customerRepo.update(findCustomer, body);
            const updatedCustomer = await customerRepo.findOneBy({
                id: findCustomer,
            });
            ctx.body = updatedCustomer;
        } else {
            ctx.status = 404;
            ctx.body = { message: "Customer not found" };
        }
    } else {
        ctx.status = 404;
        ctx.body = { message: "Customer not found" };
    }
}

//DeleteUser
export const deleteCustomer = async (ctx: Context) => {
    const findCustomerId = Number(ctx.params.id);

    if (findCustomerId) {
        const customerExist = await customerRepo.findOneBy({
            id: findCustomerId
        });

        if (customerExist) {
            await customerRepo.softDelete(findCustomerId);
            ctx.body = { message: "Customer Removed" };
        } else {
            ctx.status = 404;
            ctx.body = { message: "Customer not found" };
        }
    } else {
        ctx.status = 404;
        ctx.body = { message: "Customer not found" };
    }
}
