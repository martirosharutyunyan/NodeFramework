({
    post: async ({ name }) => {
        const { fs } = node
        return name
    },

    get: async ({a}) => {
        console.log(a)
        return a + 2
    }
})
