({
    post:async ({ name }) => {
        return name;
    },

    get: async ({a}) => {
        console.log(a)
        return a + 2
    }
})