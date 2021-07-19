"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const global_1 = require("../../global");
({
    post: async ({ name }) => {
        const { fs } = global_1.node;
        return name;
    },
    get: async ({ a }) => {
        console.log(a);
        return a + 2;
    }
});
//# sourceMappingURL=db.js.map