import { Repository } from "typeorm";
import { Client } from "../entities/Client";

export class ClientRepository {
    constructor(private repo: Repository<Client>) { }

    async getClient() {
        let client = await this.repo.findOneBy({ id: 1 });

        if(!client){
            client = this.repo.create({
                shopName: process.env.SHOPIFY_STORE,
                accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
                lastSyncStart: null,
                lastSyncEnd: null,
            });

            await this.repo.save(client);
            console.log("client created automat");
        }
        return client;
    }

    async fetchStartTime(client: Client){
        client.lastSyncStart = new Date();
        return this.repo.save(client);
    }

    async fetchEndTime(client: Client){
        client.lastSyncEnd = new Date();
        return this.repo.save(client);
    }
}

