import axios from "axios";

const SHOP_NAME = process.env.SHOPIFY_STORE!;
const TOKEN = process.env.SHOPIFY_ACCESS_TOKEN!;

export const fetchAllProducts = async () => {
    let hasNextPage = true;
    let cursor: string | null = null;

    const allProducts: any[] = [];

    while (hasNextPage) {
        const query = `
    {
    products(first: 50 ${cursor ? `, after: "${cursor}"` : ""}){
       edges{
           cursor
           node{
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
       }
          pageInfo{
            hasNextPage
          }
       }
    }`;

        const response = await axios.post(
            `https://${SHOP_NAME}.myshopify.com/admin/api/2024-04/graphql.json`,
            { query }, {
            headers: {
                "X-Shopify-Access-Token": TOKEN,
                "Content-Type": "application/json",
            },
        }
        );

        const resData = response.data;
        if (!resData || !resData.data || !resData.data.products) {
            console.log("error", resData.error)
            return [];
        }

        const data: any = resData.data.products;
        data.edges.forEach((edge: any) => {
            allProducts.push(edge.node);
        });

        hasNextPage = data.pageInfo.hasNextPage;

        if (hasNextPage) {
            cursor = data.edges[data.edges.length - 1].cursor;
        }
    }
    return allProducts;
}

export const fetchUpdatedProducts = async (lastSyncTime: string | null) => {
    let hasNextPage = true;
    let cursor: string | null = null;

    const products: any[] = [];

    while (hasNextPage) {
        const query = `
    {
    products(first: 50${cursor ? `, after: "${cursor}"` : ""} ${lastSyncTime ? `, query: "updated_at:>'${lastSyncTime}'"` : ""}){
       edges{
           cursor
           node{
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
       }
          pageInfo{
            hasNextPage
            endCursor
          }
       }
    }`;

        // console.log(query);


        const response = await axios.post(
            `https://${SHOP_NAME}.myshopify.com/admin/api/2024-04/graphql.json`,
            { query }, {
            headers: {
                "X-Shopify-Access-Token": TOKEN,
                "Content-Type": "application/json",
            },
        }
        ).catch(e => console.log(e.response.data));

        const resData = response?.data;

        // console.log(resData)
        if (!resData || !resData.data || !resData.data.products) {
            console.log("shopifycle error", resData?.data)
            return [];
        }

        const data: any = resData.data.products;
        data.edges.forEach((edge: any) => {
            products.push(edge.node);
        });

        hasNextPage = data.pageInfo.hasNextPage;

        if (hasNextPage) {
            cursor = data.edges[data.edges.length - 1].cursor;
        }
    }
    return products;
}

// export const fetchProductsById = async () => {
//     let hasNextPage = true;
//     let cursor: string | null = null;

//     const ids: string[] = [];

//     while (hasNextPage) {
//         const query = `
//     {
//     products(first: 50 ${cursor ? `, after: "${cursor}"` : ""}){
//         edges{
//            cursor
//            node{
//               id
//            }
//         }
//         pageInfo{
//             hasNextPage
//         }
//         }
//     }`;

//         const response = await axios.post(
//             `https://${SHOP_NAME}.myshopify.com/admin/api/2024-04/graphql.json`,
//             { query }, {
//             headers: {
//                 "X-Shopify-Access-Token": TOKEN,
//                 "Content-Type": "application/json",
//             },
//         }
//         );

//         const data: any = response.data?.data?.products;

//         if (!data) return [];
//         data.edges.forEach((edge: any) => {
//             ids.push(edge.node.id);
//         });

//         hasNextPage = data.pageInfo.hasNextPage;

//         if (hasNextPage) {
//             cursor = data.edges[data.edges.length - 1].cursor;
//         }
//     }
//     return ids;
// }

export const fetchDeletedProducts = async (lastSyncTime: string | null) => {
    let hasNextPage = true;
    let cursor: string | null = null;

    const deletedProducts: string[] = [];

    while (hasNextPage) {
        const query = `
    query GetProducts($cursor: String, $query: String) {
      events(first: 50, after: $cursor, query: $query) {
        nodes {
          ... on BasicEvent {
            subjectId
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

        const variables = {
            cursor,
            query: `action:'destroy' AND subject_type:'PRODUCT' AND created_at:>='${lastSyncTime}'`
        }

        console.log("q",query);
        console.log("v", variables);
        console.log("last",lastSyncTime)

        const response = await axios.post(
            `https://${SHOP_NAME}.myshopify.com/admin/api/2024-04/graphql.json`,
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
            deletedProducts.push(node.subjectId);
        });

        console.log(data);

        hasNextPage = data.pageInfo.hasNextPage;

        if (hasNextPage) {
            cursor = data.edges[data.edges.length - 1].cursor;
        }
    }
    return deletedProducts;
}