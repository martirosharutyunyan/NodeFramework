({
    post: async ({ name }) => {
        const product = await db.select('products', ['id', 'productNameHY'],  { codeOfProduct: "codeOfProduct" })
        return product; 
    },

    get: async ({ name }) => {
        console.log('ok')
        return await services.test.test.test.get({ name })
    }
})