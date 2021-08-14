({
    post: async ({ name }) => {
        return name; 
    },

    get: async ({ name }) => {
        console.log('ok')
        return await services.test.test.test.get({ name })
    }
})