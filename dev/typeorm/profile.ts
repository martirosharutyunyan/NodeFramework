({
    name:'profiles',
    columns:{
        photo: {
            type: 'varchar',
        },
        gender: {
            type: 'varchar',
        },
        userId: {
            type: 'int',
        }
    }
}) as EntitySchema<{photo: string, gender: string, userId: string}>