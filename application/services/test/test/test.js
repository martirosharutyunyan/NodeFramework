"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const global_1 = require("../../../../global");
({
    get: async ({ name }) => {
        console.log(global_1.db);
        return await global_1.db.select('products', ['id', 'productNameHY'], { codeOfProduct: "codeOfProduct" });
    }
});
//# sourceMappingURL=test.js.map