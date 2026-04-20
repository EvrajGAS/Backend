import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config()
import { AppDataSource } from "./datasource/app";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import productRoutes from "./routes/productRoutes"
import { startCron } from "./cron/cronjob";

const port = 3000;

const app = new Koa();

app.use(bodyParser());
app.use(productRoutes.routes()).use(productRoutes.allowedMethods());

AppDataSource.initialize()
    .then(() => {
        console.log("Database connected");

        startCron();

        app.listen(port, () => {
            console.log(`server running at http://localhost:${port}`);
        });
    }).catch((err) => {
        console.log("err", err);
    });

