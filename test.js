import { createConnection, Entity, EntitySchema, EntitySchemaColumnOptions, getRepository } from "typeorm";


const staticEntity = {
    id: {
        type: Number,
        primary: true,
        generated: true,
    },
    createdAt: {
        name: 'created_at',
        type: 'timestamp with time zone',
        createDate: true,
    },
    updatedAt: {
        name: 'updated_at',
        type: 'timestamp with time zone',
        updateDate: true,
    } 
};

const userEntity/*: EntitySchema*/ = new EntitySchema({
    name: 'users',
    columns: {
        ...staticEntity,
        name: { 
            type: 'varchar',
        },
        surname: {
            type: 'varchar',
        },
    }
})

const connection = createConnection({
    type: 'postgres',
    database: "usersDB",
    password: "hhs13516",
    port: 5432,
    host: "127.0.0.1",
    entities: [userEntity],
    username: "postgres",
    synchronize: true,
})

connection.then(async res => {
    const userRepository = getRepository(userEntity);
    const user = { 
        name: 'martiros',
        surname: 'harutyunyan'
    }
    const userEntit = userRepository.create(user)
    await userRepository.save(userEntit);
})

