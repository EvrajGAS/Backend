import { Context } from "koa";
import { serviceRepo } from "../repository/serviceRepo";
import { CreateService } from "../types/interfaces";

export const createService = async (ctx: Context) => {
    const body = ctx.request.body as CreateService;
    const service = serviceRepo.create(body);

    await serviceRepo.save(service);
    ctx.body = service;
}

export const getServices = async (ctx: Context) => {
    const services = await serviceRepo.find();
    ctx.body = services;
}
