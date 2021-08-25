({
    async get(): Promise<post[]> {
        return await db.posts.createQueryBuilder('posts')
            .leftJoinAndSelect('posts.user', 'user')
            .getMany();
    },

    async post(createPostDto:post): Promise<post> {
        const postEntity = db.posts.create(createPostDto);
        await db.posts.save(postEntity);
        return postEntity;
    },

    async delete({ id: postId }): Promise<void> {
        await db.users.createQueryBuilder()
            .delete()
            .where('id = :postId', { postId })
            .execute();
    },
});
