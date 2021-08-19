({
    name: 'users',
    columns: {
        name: { 
            type: 'varchar',
        },
        surname: {
            type: 'varchar',
        },
        image: {
            type: 'varchar',
        }
    },
}) as EntitySchema<{
    name: string,
    surname: string;
    image: string;
}>