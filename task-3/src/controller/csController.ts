import { Context } from "koa";
import { AppDataSource } from "../datasource/app";
import { Customer } from "../entity/customer";
import { Service } from "../entity/service"

const customerRepo = AppDataSource.getRepository(Customer);
const serviceRepo = AppDataSource.getRepository(Service);

export const assignService = async (ctx: Context) => {
    const { id, serviceId } = ctx.params;
    const customer = await customerRepo.findOne({
        where: { id: Number(id) },
        relations: ["services"],
    });

    const service = await serviceRepo.findOneBy({
        id: Number(serviceId)
    });

    if (!customer || !service) {
        ctx.status = 404;
        ctx.body = { message: "Something went wrong" };

    }

    const alrExist = customer!.services.find((s) => s.id === service!.id);
    if (alrExist) {
        ctx.status = 404;
        ctx.body = { message: "service already exist!" };
    }

    customer!.services.push(service as any);
    await customerRepo.save(customer as any);
    ctx.body = customer;
}

export const getCustomerServices = async (ctx: Context) => {
    const customer = await customerRepo.findOne({
        where: { id: Number(ctx.params.id) },
        relations: ["services"],
    });

    if (!customer){
        ctx.status = 404;
        ctx.body = { message: "No customer found" };
    }

    ctx.body = customer!.services;
}