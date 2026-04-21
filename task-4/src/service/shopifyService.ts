import axios from "axios";
import { batchSizes } from "../utils/constant";

const SHOP_NAME = process.env.SHOPIFY_STORE!;
const TOKEN = process.env.SHOPIFY_ACCESS_TOKEN!;

export const fetchAllProducts = async (cursor: string | null) => {
    const query = `
    {
    products(first: ${batchSizes.actual} ${cursor ? `, after: "${cursor}"` : ""}){ 
           nodes{
              id
              title
              description
              vendor
              productType
              publishedAt
              variants(first:50){
                 edges{
                    node{
                       id
                       title
                       displayName
                       price
                       sku
                       createdAt
                    }
                 }
              }
           }
          pageInfo{
            endCursor
            hasNextPage
          }
       }
    }`;

    const response = await axios.post(
        `https://${SHOP_NAME}.myshopify.com/admin/api/2026-04/graphql.json`,
        { query }, {
        headers: {
            "X-Shopify-Access-Token": TOKEN,
            "Content-Type": "application/json",
        },
    }
    );

    const data = response?.data?.data?.products;

    if (!data) {
        throw new Error("Shopify fetch error");
    }
    return {
        products: data.nodes,
        hasNextPage: data.pageInfo.hasNextPage,
        cursor: data.pageInfo.endCursor,
    };

}

export const fetchUpdatedProducts = async (cursor: string | null, lastSyncTime: string | null) => {
    const query = `
    {
    products(first: ${batchSizes.actual}${cursor ? `, after: "${cursor}"` : ""} ${lastSyncTime ? `, query: "updated_at:>'${lastSyncTime}'"` : ""}){    
           nodes{
              id
              title
              description
              vendor
              productType
              publishedAt
              updatedAt
              variants(first:50){
                 edges{
                    node{
                       id
                       title
                       displayName
                       price
                       sku
                       createdAt
                    }
                 }
              }
            }
       
          pageInfo{
            hasNextPage
            endCursor
          }
       }
    }`;

    const response = await axios.post(
        `https://${SHOP_NAME}.myshopify.com/admin/api/2026-04/graphql.json`,
        { query }, {
        headers: {
            "X-Shopify-Access-Token": TOKEN,
            "Content-Type": "application/json",
        },
    }
    ).catch(e => console.log(e.response.data));

    const data = response?.data?.data?.products;

    if (!data) {
        throw new Error("Shopify fetch error");
    }

    return {
        products: data.nodes,
        hasNextPage: data.pageInfo.hasNextPage,
        cursor: data.pageInfo.endCursor,
    };
}

export const fetchDeletedProducts = async (lastSyncTime: string | null) => {
    let hasNextPage = true;
    let cursor: string | null = null;

    const deletedProducts: { id: string; time: string }[] = [];

    while (hasNextPage) {
        const query = `
            query GetProducts($cursor: String, $query: String) {
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

        const variables = {
            cursor,
            query: `action:'destroy' AND subject_type:'PRODUCT' AND created_at:>='${lastSyncTime}'`
        }

        const response = await axios.post(
            `https://${SHOP_NAME}.myshopify.com/admin/api/2026-04/graphql.json`,
            { query, variables }, {
            headers: {
                "X-Shopify-Access-Token": TOKEN,
                "Content-Type": "application/json",
            },
        }
        );

        const data: any = response.data?.data?.events;
        if (!data) return [];


        data.nodes.forEach((node: any) => {
            deletedProducts.push({
                id: node.subjectId,
                time: node.createdAt
            })
        });

        hasNextPage = data.pageInfo.hasNextPage;

        if (hasNextPage) {
            cursor = data.pageInfo.endCursor
        }
    }

    return deletedProducts;
}