({
    get: async ({ name }) => {
        console.log(db)
        return await db.select('products', ['id', 'productNameHY'], { codeOfProduct: "codeOfProduct" });
    }
})