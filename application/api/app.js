({
    post: async ({ name }) => {
        const path = node.path
        return name
    },

    get: async ({a}) => {
        console.log(a)
        return a + 2
    }
})