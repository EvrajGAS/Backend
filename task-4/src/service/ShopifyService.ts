import axios from "axios";
import { batchSizes } from "../utils/Constant";
import { Client } from "../entities/Client";

export class ShopifyService {
    constructor(private client: Client) { }

    private async request(query: string, variables?: any) {
        const res = await axios.post(
            `https://${this.client.shopName}.myshopify.com/admin/api/2026-04/graphql.json`,
            { query, variables },
            {
                headers: {
                    "X-Shopify-Access-Token": this.client.accessToken,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!res.data.data) {
            console.log("Invalid shopify response", res.data);
            throw new Error("no data returned");
        }

        return res.data.data;
    }

    async fetchProducts(cursor: string | null, lastSync: string | null) {
        const query = `{
            products(first: ${batchSizes.actual} ${cursor ? `, after: "${cursor}"` : ""} ${lastSync ? `, query: "updated_at:>'${lastSync}'"` : ""}){
                nodes{
                    id
                    title
                    vendor
                    productType
                    handle
                    status
                    tags
                    options {
                        name 
                        values
                    }
                    variantsCount{
                        count
                    }
                    createdAt
                    publishedAt
                    updatedAt
                }
                pageInfo{
                    hasNextPage
                    endCursor
                }        
            }}`;

        const data = await this.request(query);

        return {
            products: data.products.nodes,
            hasNextPage: data.products.pageInfo.hasNextPage,
            endCursor: data.products.pageInfo.endCursor,
        };
    }

    async fetchVariants(cursor: string | null, lastSync: string | null) {
        const query = `{
            productVariants(first: ${batchSizes.actual} ${cursor ? `, after: "${cursor}"` : ""} ${lastSync ? `, query: "updated_at:>'${lastSync}'"` : ""}){
                nodes{
                    id
                    title
                    inventoryPolicy
                    inventoryQuantity
                    price
                    compareAtPrice
                    unitPrice{
                        amount
                    }
                    sku
                    selectedOptions {name value}
                    createdAt
                    updatedAt
                    product{
                        id
                    }
                }
                pageInfo{
                    hasNextPage
                    endCursor
                }        
            }}`;


        const data = await this.request(query);

        return {
            variants: data.productVariants.nodes,
            hasNextPage: data.productVariants.pageInfo.hasNextPage,
            endCursor: data.productVariants.pageInfo.endCursor,
        };
    }

    async fetchDeleted(cursor: string | null, lastSync: string | null) {
        if(!lastSync){
            return{
                deleted: [],
                hasNextPage: false,
                endCursor: null
            }
        }

        const query = `
            query fetchDeleted($cursor: String ,$query: String) {
                events(first: ${batchSizes.actual}, after: $cursor, query: $query) {
                     nodes {
                       ... on BasicEvent {
                           subjectId
                           createdAt
                         }
                      }
                     pageInfo {
                           hasNextPage
                           endCursor
                        }
                    }
                }`;

        const variables: any = {
            cursor: cursor,
            query: lastSync ? `action:'destroy' AND subject_type:'PRODUCT' and created_at:>'${lastSync}'` : `action: 'destroy' AND subject_type:'PRODUCT'`
        };


        const data = await this.request(query, variables);

        if (!data.events) {
            console.error("No events found", data);
            return {
                deleted: [],
                hasNextPage: false,
                cursor: null
            };
        }

        const deleted = data.events.nodes.map((n: any) => ({
            id: n.subjectId,
            time: n.createdAt,
        }));

        return {
            deleted,
            hasNextPage: data.events.pageInfo.hasNextPage,
            endCursor: data.events.pageInfo.endCursor
        }
    }
}