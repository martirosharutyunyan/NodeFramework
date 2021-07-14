({
    post: async ({ pass }) => {
        return node.bcrypt.hash(pass, 10)
    }
})