({
    get: async ({ name }) => {
        console.log(name)
        return npm.bcrypt.hash('sad', 10);
    }
})