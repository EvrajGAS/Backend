import "reflect-metadata";
import { AppDataSource } from "./datasource/app";
import express from "express";
import customerRoutes from "./routes/customerRoutes"
import kycRoutes from "./routes/kycRoutes"
import accountRoutes from "./routes/accountRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import loanRoutes from "./routes/loanRoutes";
import serviceRoutes from "./routes/serviceRoutes";
import csRoutes from "./routes/csRouter"

const app = express();

const port = 3001;

app.use(express.json());
app.use("/customer", customerRoutes);
app.use("/customer/:id/kyc", kycRoutes);
app.use("/accounts", accountRoutes);
app.use("/", transactionRoutes);
app.use("/", loanRoutes);
app.use("/services", serviceRoutes);
app.use("/", csRoutes);

AppDataSource.initialize()
    .then(() => {
        console.log("Database connected");

        app.listen(port, () => {
            console.log(`server running at http://localhost:${port}`);
        });
    }).catch((err) => {
        console.log("err", err);
    })