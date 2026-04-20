import { Context } from "koa";
import { customerRepo } from "../repository/customerRepo";
import { kycRepo } from "../repository/kycRepo";
import { validateKYC } from "../utils/validateKYC";
import { CreateKYC } from "../types/interfaces";



export const createKYC = async (ctx: Context) => {
    const body = ctx.request.body as CreateKYC;
    const errors = validateKYC(body);

    if (errors.length > 0) {
        ctx.status = 404;
        ctx.body = errors;
        return;
    }

    const customerId = Number(ctx.params.id)
    if (customerId) {
        const customer = await customerRepo.findOne({
            where: { id: customerId },
            relations: ["kyc"],
        });

        if (!customer) {
            ctx.status = 404;
            ctx.body = { mesaage: "Customer not found" };
        }
        else if (customer.kyc) {
            ctx.status = 404;
            ctx.body = { mesaage: "KYC aready exists!" };
            return;
        }

        const kyc = kycRepo.create({ ...body, customer: customer! });
        await kycRepo.save(kyc);

        ctx.status = 201;
        ctx.body = kyc;
    } else {
        ctx.status = 404;
        ctx.body = { mesaage: "Customer not found" };
    }
}

//getKYC
export const getKYC = async (ctx: Context) => {
    const customerId = Number(ctx.params.id)

    if (customerId) {
        const kyc = await kycRepo.findOne({
            where: { customer: { id: customerId } }
        });

        if (kyc) ctx.body = kyc;
        else {
            ctx.status = 404;
            ctx.body = { mesaage: "KYC not found" };
        }
    }
    else {
        ctx.status = 404;
        ctx.body = { mesaage: "KYC not found" };
    }
}

//UpdateKYC
export const updateKYC = async (ctx: Context) => {
    const kyc = await kycRepo.findOne({
        where: { customer: { id: Number(ctx.params.id) } }
    });

    if (!kyc) {
        ctx.status = 404;
        ctx.body = { mesaage: "KYC not found" };
        return;
    }

    kycRepo.merge(kyc, ctx.request.body as CreateKYC);
    await kycRepo.save(kyc);

    ctx.body = kyc;
}

