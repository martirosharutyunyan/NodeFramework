"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var typeorm_1 = require("typeorm");
var staticEntity = {
    id: {
        type: Number,
        primary: true,
        generated: true
    },
    createdAt: {
        name: 'created_at',
        type: 'timestamp with time zone',
        createDate: true
    },
    updatedAt: {
        name: 'updated_at',
        type: 'timestamp with time zone',
        updateDate: true
    }
};
var userEntity = new typeorm_1.EntitySchema({
    name: 'users',
    columns: __assign(__assign({}, staticEntity), { name: {
            type: 'varchar'
        }, surname: {
            type: 'varchar'
        } })
});
// const connection = createConnection({
//     type: 'postgres',
//     database: "usersDB",
//     password: "hhs13516",
//     port: 5432,
//     host: "127.0.0.1",
//     entities: [userEntity],
//     username: "postgres",
//     synchronize: true,
// })
// connection.then(async res => {
//     const userRepository = getRepository(userEntity);
//     const user = { 
//         name: 'martiros',
//         surname: 'harutyunyan'
//     }
//     const userEntit = userRepository.create(user)
//     await userRepository.save(userEntit);
// })
module.exports = typeorm_1.getRepository(userEntity);
