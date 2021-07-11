const express = require("express");
const morgan = require("morgan");
const app = express();
app.use(morgan(`dev`));
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}));

            app.post("/api/app", async (req, res) => {
                const { body } = req
                res.send(await (async ({ name }) => {
        return name;
    })(body))
            })
            
            app.get("/api/app", async (req, res) => {
                const { query } = req
                res.send(await (async ({a}) => {
        console.log(a)
        return a + 2
    })(query))
            })
            
            app.post("/api/user/getUser", async (req, res) => {
                const { body } = req
                res.send(await (async ({ pass }) => {
        const user = await require("bcrypt").hash(pass, 10)
        // const user2 = await require("bcrypt").hash(10, pass)
        return pass; 
    })(body))
            })
            
            app.get("/api/user/getUser", async (req, res) => {
                const { query } = req
                res.send(await (async ({ name }) => {
        return name;
    })(query))
            })
            
app.listen(8888, () => console.log("server in running on http://localhost:8888"))