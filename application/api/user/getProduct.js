({
    post: async ({ name }) => {
        console.log(codeOfProduct)
        const product = await db.select('products', ['id', 'productNameHY'],  { codeOfProduct })
        return product; 
    },

    get: async ({ name }) => {
        return name;
    }
})