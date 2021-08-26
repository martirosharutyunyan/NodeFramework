({
    name: 'users',
    columns: {
        name: {
            type: 'varchar',
        },
        surname: {
            type: 'varchar',
        },
    },
    relations: {
        posts: {
            type: 'one-to-many',
            target: 'posts',
            inverseSide: 'user',
        },
    },
} as EntitySchema<user>);
