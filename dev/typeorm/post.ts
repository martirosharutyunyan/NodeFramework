({
    name: 'posts',
    columns: {
        userId: { type: 'uuid' },
        title: { type: 'varchar' },
        content: { type: 'varchar' },
    },
    relations: {
        user: {
            type: 'many-to-one',
            joinColumn: 'user_id',
            inverseSide: 'posts',
            target: 'users',
        },
    },
} as EntitySchema<post>);
