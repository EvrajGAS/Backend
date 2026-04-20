import "reflect-metadata";
import { AppDataSource } from "./datasource/app";
import Koa from "koa";
import customerRoutes from "./routes/customerRoutes"
import kycRoutes from "./routes/kycRoutes"
import accountRoutes from "./routes/accountRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import loanRoutes from "./routes/loanRoutes";
import serviceRoutes from "./routes/serviceRoutes";
import csRoutes from "./routes/csRoutes"
import bodyParser from "koa-bodyparser";

const app = new Koa();

const port = 3001;
app.use(bodyParser());
app.use(customerRoutes.routes()).use(customerRoutes.allowedMethods());
app.use(accountRoutes.routes()).use(accountRoutes.allowedMethods());
app.use(kycRoutes.routes()).use(kycRoutes.allowedMethods());
app.use(transactionRoutes.routes()).use(transactionRoutes.allowedMethods());
app.use(loanRoutes.routes()).use(loanRoutes.allowedMethods());
app.use(serviceRoutes.routes()).use(serviceRoutes.allowedMethods());
app.use(csRoutes.routes()).use(csRoutes.allowedMethods());

AppDataSource.initialize()
    .then(() => {
        console.log("Database connected");

        app.listen(port, () => {
            console.log(`server running at http://localhost:${port}`);
        });
    }).catch((err) => {
        console.log("err", err);
    })