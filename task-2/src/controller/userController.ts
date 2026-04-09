import { Request, Response } from "express";
import { AppDataSource } from "../datasource/app";
import { User } from "../entity/user";
import { validateUser } from "../utils/validateUser";

const userRepository = AppDataSource.getRepository(User);

//createUser
export const createUser = async (req: Request, res: Response) => {
    const errors = validateUser(req.body);

    if (errors.length > 0) {
        return res.status(404).json({ errors })
    }

    const user = userRepository.create(req.body);
    const result = await userRepository.save(user);

    res.status(201).json(result);
}

//findAllUsers
export const findUsers = async (req: Request, res: Response) => {
    const users = await userRepository.find();

    res.json(users);
}


//findUserbyID
export const findUser = async (req: Request, res: Response) => {
    const findUser = Number(req.params.id);

    if (findUser) {
        const user = await userRepository.findOneBy({
            id: Number(req.params.id)
        });

        if (user) res.json(user);

        else res.status(404).json({ message: "user not found" });
    } else {
        res.status(404).json({ message: "user not found" });
    }

}

//UpdateUser
export const updateUser = async (req: Request, res: Response) => {
    const errors = validateUser(req.body);

    if (errors.length > 0) {
        return res.status(404).json({ errors })
    }


    const findUser = Number(req.params.id);
    if (findUser) {
        const userExist = await userRepository.findOneBy({
            id: findUser
        });

        if (userExist) {
            await userRepository.update(findUser, req.body);
            const updated = await userRepository.findOneBy({
                id: findUser
            });

            res.json(updated);
        } else {
            res.status(404).json({ message: "user not found" })
        }
    } else {
        res.status(404).json({ message: "user not found" })
    }
}


//DeleteUser
export const deleteUser = async (req: Request, res: Response) => {
    const findUser = Number(req.params.id);

    if (findUser) {
        const userExist = await userRepository.findOneBy({
            id: findUser
        });

        if (userExist) {
            await userRepository.delete(Number(req.params.id));
            res.json({ message: "user deleted" });
        } else {
            res.status(404).json({ message: "user not found" })
        }
    } else {
        res.status(404).json({ message: "user not found" })
    }
}