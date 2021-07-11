({
    post: async ({ pass }) => {
        const user = await node.bcrypt.hash(pass, 10)
        // const user2 = await node.bcrypt.hash(10, pass)
        return user; 
    },

    get: async ({ name }) => {
        return name;
    }
})