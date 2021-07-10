({
    async post(pass) {
        const user = await node.bcrypt.hash(10, pass)
        return user; 
    }
})