"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const global_1 = require("../../../global");
({
    post: async ({ name }) => {
        const product = await global_1.db.select('products', ['id', 'productNameHY'], { codeOfProduct: "codeOfProduct" });
        return product;
    },
    get: async ({ name }) => {
        return name;
    }
});
//# sourceMappingURL=getProduct.js.map