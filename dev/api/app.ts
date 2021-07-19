import { node, db, npm } from '../../global';
({
    post: async ({ name }) => {
        const { path, fs } = node
        return name
    },

    get: async ({ a }) => {
        const { bcrypt } = npm
        return a + 2
    }
})