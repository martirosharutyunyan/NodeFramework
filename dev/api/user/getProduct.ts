({
    post: ({ name }) => name,

    get: async ({ name }) => await services.test.test.test.get({ name }),
});
