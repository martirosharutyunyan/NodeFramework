({
    post: async ({ name }) => {
        const path = node.path
        return name
    },

    get: async ({a}) => {
        console.log(a)
        return a + 2
    },

    static2: async({a}) => {
        return a;
    }
})