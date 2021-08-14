({
    post: async ({ name }) => {
        const { path, fs } = node
        return name + name
    },

    get: async ({ name }) => {
        return services.test.test.test.get({ name })
    }
})