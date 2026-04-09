import "reflect-metadata";
import { AppDataSource } from "./datasource/app";
import express from "express";
import userRoutes from "./routes/userRoutes"

const app = express();

const port = 3001;

app.use(express.json());
app.use("/users", userRoutes);

AppDataSource.initialize()
    .then(() => {
        console.log("Database connected");

        app.listen(port, () => {
            console.log(`server running at http://localhost:${port}`);
        });
    }).catch((err) => {
        console.log("err", err);
    })