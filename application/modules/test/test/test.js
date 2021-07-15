({
    get: async ({ name }) => {
        return await db.select('products', ['id', 'productNameHY'], { codeOfProduct: "codeOfProduct" });
    }
})