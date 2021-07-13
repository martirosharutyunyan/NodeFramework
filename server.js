const express = require("express");
const morgan = require("morgan");
const app = express();
const fs = require('fs');
app.use(morgan(`dev`));
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}));
const node = require("./packages.js")
const config = eval(fs.readFileSync('./application/config/config.js', 'utf8'))

const { Database } = require('metasql');
const db = new Database(config.db)

app.post("/api/app", async (req, res) => {
    const { body } = req
    res.send(await (async ({ name }) => {
        const path = node.path
        return name
    })(body))
})
            
app.get("/api/app", async (req, res) => {
    const { query } = req
    res.send(await (async ({a}) => {
        console.log(a)
        return a + 2
    })(query))
})
            
app.post("/api/test", async (req, res) => {
    const { body } = req
    res.send(await (async ({ pass }) => {
        return node.bcrypt.hash(pass, 10)
    })(body))
})
            
app.get("/api/user/getCity", async (req, res) => {
    const { query } = req
    res.send(await (async ({ city }) => {
        console.log({ city })
        return city;
    })(query))
})
            
app.post("/api/user/getProduct", async (req, res) => {
    const { body } = req
    res.send(await (async ({ name }) => {
        console.log(codeOfProduct)
        const product = await db.select('products', ['id', 'productNameHY'],  { codeOfProduct })
        return product; 
    })(body))
})
            
app.get("/api/user/getProduct", async (req, res) => {
    const { query } = req
    res.send(await (async ({ name }) => {
        return name;
    })(query))
})
            
app.get("/api/user/test/test", async (req, res) => {
    const { query } = req
    res.send(await (async ({ city }) => {
        console.log({ city })
        return city;
    })(query))
})
            
app.get("/api/user/test/test2", async (req, res) => {
    const { query } = req
    res.send(await (async ({ city }) => {
        console.log({ city })
        return city;
    })(query))
})
            
app.listen(config.port, () => console.log("server in running on port http://localhost:" + config.port))