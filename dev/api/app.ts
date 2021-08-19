({
    post: async (user: user) => {
        const userEntity = db.users.create(user);
        await db.users.save(userEntity)
        console.log(userEntity)
        return userEntity;
    },

    get: async ({ name }): Promise<user[]> => {
        const users = await db.users.createQueryBuilder('users').getMany()
        return users;
    }
})