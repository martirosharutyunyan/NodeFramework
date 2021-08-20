({
    post: async (user: user) => {
        const userEntity = db.users.create(user);
        await db.users.save(userEntity);

        return userEntity;
    },

    get: async ({ name }): Promise<user[]> =>



    
    
        await db.users.createQueryBuilder('users').getMany(),
});
