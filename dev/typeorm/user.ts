({
    name: 'users',
    columns: {
        name: { type: 'varchar' },
        surname: { type: 'varchar' }
    },
}) as EntitySchema<{
    name: string,
    surname: string,
}>