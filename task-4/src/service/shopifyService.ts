import axios from "axios";
import { batchSizes } from "../utils/constant";

const SHOP_NAME = process.env.SHOPIFY_STORE!;
const TOKEN = process.env.SHOPIFY_ACCESS_TOKEN!;
const URL = `https://${SHOP_NAME}.myshopify.com/admin/api/2026-04/graphql.json`;

export const fetchAllProducts = async (cursor: string | null) => {
    try {
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
                        updatedAt
                    }
                    pageInfo{
                        endCursor
                        hasNextPage
                    }
                }
            }`;

        const response = await axios.post(
            URL,
            { query }, {
            headers: {
                "X-Shopify-Access-Token": TOKEN,
                "Content-Type": "application/json",
            },
        });

        const data = response?.data?.data?.products;

        if (!data) {
            throw new Error("Shopify fetchAllProducts error");
        }
        return {
            products: data.nodes,
            hasNextPage: data.pageInfo.hasNextPage,
            cursor: data.pageInfo.endCursor,
        };
    }
    catch (error: any) {
        console.log('Shopify services fetchAllProducts error', JSON.stringify(error));
        throw new Error("Shopify fetchAllProducts error");
    }
}

export const fetchUpdatedProducts = async (cursor: string | null, lastSyncTime: string | null) => {
    try {
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
                    }
                    pageInfo{
                        hasNextPage
                        endCursor
                    }
                }
            }`;

        const response = await axios.post(
            URL,
            { query }, {
            headers: {
                "X-Shopify-Access-Token": TOKEN,
                "Content-Type": "application/json",
            },
        }
        ).catch(e => console.log(e.response.data));

        const data = response?.data?.data?.products;

        if (!data) {
            throw new Error("Shopify fetchUpdatedProducts error");
        }

        return {
            products: data.nodes,
            hasNextPage: data.pageInfo.hasNextPage,
            cursor: data.pageInfo.endCursor,
        };
    } catch (error: any) {
        console.log('Shopify services fetchUpdatedProducts error', JSON.stringify(error));
        throw new Error("Shopify fetchUpdatedProducts error");
    }
}

export const fetchVariantsByProductId = async (cursor: string | null) => {
    try {
        const query = `
            {
                productVariants(first: ${batchSizes.actual}${cursor ? `, after: "${cursor}"` : ""}){
                    nodes{
                        id
                        title
                        displayName
                        price
                        sku
                        createdAt
                        product {
                            id
                        }
                    }
                    pageInfo{
                        hasNextPage
                        endCursor
                    }
                }
            }`;

        const response = await axios.post(
            URL,
            { query }, {
            headers: {
                "X-Shopify-Access-Token": TOKEN,
                "Content-Type": "application/json",
            },
        }
        ).catch(e => console.log(e.response.data));

        const data = response?.data?.data?.productVariants;

        if (!data) {
            throw new Error("Shopify fetchVariantsByProductId error");
        }

        return {
            variants: data.nodes,
            hasNextPage: data.pageInfo.hasNextPage,
            cursor: data.pageInfo.endCursor,
        };
    } catch (error: any) {
        console.log('Shopify services fetchVariantsByProductId error', JSON.stringify(error));
        throw new Error("Shopify fetchVariantsByProductId error");
    }
}

export const fetchUpdatedVariants = async (cursor: string | null, lastSyncTime: string | null) => {
    try {
        const query = `
            {
                productVariants(first: ${batchSizes.actual}${cursor ? `, after: "${cursor}"` : ""} ${lastSyncTime ? `, query: "updated_at:>'${lastSyncTime}'"` : ""}){
                    nodes{
                        id
                        title
                        displayName
                        price
                        sku
                        createdAt
                        product{
                            id
                        }
                    }
                    pageInfo{
                        hasNextPage
                        endCursor
                    }
                }
            }`;

        const response = await axios.post(
            URL,
            { query }, {
            headers: {
                "X-Shopify-Access-Token": TOKEN,
                "Content-Type": "application/json",
            },
        }
        ).catch(e => console.log(e.response.data));

        const data = response?.data?.data?.productVariants;

        if (!data) {
            throw new Error("Shopify fetchUpdatedVariants error");
        }

        return {
            variants: data.nodes,
            hasNextPage: data.pageInfo.hasNextPage,
            cursor: data.pageInfo.endCursor,
        };
    } catch (error: any) {
        console.log('Shopify services fetchUpdatedVariants error', JSON.stringify(error));
        throw new Error("Shopify fetchUpdatedVariants error");
    }
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
            URL,
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
        cursor = data.pageInfo.endCursor
    }
    
    return deletedProducts;
};
