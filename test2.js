const { EntitySchema } = require('typeorm');
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
