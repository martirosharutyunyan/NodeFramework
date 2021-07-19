import { db } from "../../../global";

({
    post: async ({ name }) => {
        const product = await db.select('products', ['id', 'productNameHY'],  { codeOfProduct: "codeOfProduct" })
        return product; 
    },

    get: async ({ name }) => {
        return name
    }
})