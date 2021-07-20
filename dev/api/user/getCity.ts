({
    get: async ({ name }) => {
        console.log({ name })
        return name;
    }
})