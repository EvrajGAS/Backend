import { Request, Response } from "express";
import { AppDataSource } from "../datasource/app";
import { Customer } from "../entity/customer";
import { validateCustomer } from "../utils/validateCustomer"

const customerRepo = AppDataSource.getRepository(Customer);

//createCustomer
export const createCustomer = async (req: Request, res: Response) => {
    const errors = validateCustomer(req.body);

    if (errors.length > 0) {
        return res.status(404).json({ errors })
    }

    const user = customerRepo.create(req.body);
    const result = await customerRepo.save(user);

    res.status(201).json(result);
}

//getCustomers
export const getCustomers = async (req: Request, res: Response) => {
    const customers = await customerRepo.find();
    res.json(customers)
}


//getCustomerById
export const getCustomerById = async (req: Request, res: Response) => {
    const findCustomerId = Number(req.params.id);

    if (findCustomerId) {
        const customer = await customerRepo.findOneBy({
            id: findCustomerId
        });

        if (customer) res.json(customer);
        else res.status(404).json({ message: "Customer not Found!" });
    } else {
        res.status(404).json({ message: "Customer not Found!" });
    }
}


//updateCustomer
export const updateCustomer = async (req: Request, res: Response) => {
    const errors = validateCustomer(req.body);

    if (errors.length > 0) {
        return res.status(404).json({ errors })
    }

    const findCustomer = Number(req.params.id);

    if (findCustomer) {
        const customerExist = await customerRepo.findOneBy({
            id: findCustomer
        });

        if (customerExist) {
            await customerRepo.update(findCustomer, req.body);
            res.json(customerExist); //print updated value
        } else {
            res.status(404).json({ message: "Customer not Found!" });
        }
    } else {
        { message: "Customer not Found!" };
    }
}

//DeleteUser
export const deleteCustomer = async (req: Request, res: Response) => {
    const findCustomerId = Number(req.params.id);

    if (findCustomerId) {
        const customerExist = await customerRepo.findOneBy({
            id: findCustomerId
        });

        if (customerExist) {
            await customerRepo.delete(Number(req.params.id));
            res.json({ message: "Customer Removed" });
        } else {
            res.status(404).json({ message: "Customer not found" })
        }
    } else {
        res.status(404).json({ message: "Customer not found" })
    }
}
