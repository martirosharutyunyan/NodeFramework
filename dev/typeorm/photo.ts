({
    name: 'photos',
    columns: {
        name: { type: 'varchar' },
        photo: { type: 'varchar' }
    }
}) as EntitySchema<{
    name: string;
    photo: string;
}>