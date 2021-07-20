({
    get: async ({ name }) => {
        return api.user.getCity.get({ name })
        // return await db.select('products', ['id', 'productNameHY'], { codeOfProduct: "codeOfProduct" });
    }
})