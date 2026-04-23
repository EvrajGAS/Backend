import "reflect-metadata";
import { AppDataSource } from "./datasource/app";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import { startCron } from "./cron/cronjob";

const port = 3000;

const app = new Koa();

app.use(bodyParser());

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

