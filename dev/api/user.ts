({
    async get(): Promise<user[]> {
        return await db.users.createQueryBuilder('users')
            .leftJoinAndSelect('users.posts', 'posts')
            .getMany();
    },

    async post(body: user): Promise<user> {
        const userEntity = db.users.create(body);
        await db.users.save(userEntity);
        return userEntity;
    },
    
    async delete({ id: userId }): Promise<void> {
        await db.users.createQueryBuilder()
            .delete()
            .where('id = :userId', { userId })
            .execute();
    },
})