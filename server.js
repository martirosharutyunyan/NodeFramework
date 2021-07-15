const express = require("express");
const morgan = require("morgan");
const fs = require('fs');
const Thread = require("funthreads")
const app = express();
app.use(morgan(`dev`));
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}));
const config = eval(fs.readFileSync(process.cwd() + '/application/config/config.js', 'utf8'))
const { Database } = require('metasql');
const db = new Database(config.db)

const api = {}

api.ddsa = {}
api.user = {}
api.user.test = {}
api.user.test.router = {}
api.app = eval(fs.readFileSync('D:/ /node-js/NodeFramework/application/api/app.js', 'utf8'))
api.tes2 = eval(fs.readFileSync('D:/ /node-js/NodeFramework/application/api/tes2.js', 'utf8'))
api.test = eval(fs.readFileSync('D:/ /node-js/NodeFramework/application/api/test.js', 'utf8'))
api.test3 = eval(fs.readFileSync('D:/ /node-js/NodeFramework/application/api/test3.js', 'utf8'))
api.test4 = eval(fs.readFileSync('D:/ /node-js/NodeFramework/application/api/test4.js', 'utf8'))
api.test5 = eval(fs.readFileSync('D:/ /node-js/NodeFramework/application/api/test5.js', 'utf8'))
api.user.getCity = eval(fs.readFileSync('D:/ /node-js/NodeFramework/application/api/user/getCity.js', 'utf8'))
api.user.getProduct = eval(fs.readFileSync('D:/ /node-js/NodeFramework/application/api/user/getProduct.js', 'utf8'))
api.user.test.router.router = eval(fs.readFileSync('D:/ /node-js/NodeFramework/application/api/user/test/router/router.js', 'utf8'))
api.user.test.test = eval(fs.readFileSync('D:/ /node-js/NodeFramework/application/api/user/test/test.js', 'utf8'))
api.user.test.test2 = eval(fs.readFileSync('D:/ /node-js/NodeFramework/application/api/user/test/test2.js', 'utf8'))
Object.freeze(api)


const modules = {}

modules.test = {}
modules.test.test = {}
modules.test.test.test = eval(fs.readFileSync('D:/ /node-js/NodeFramework/application/modules/test/test/test.js', 'utf8'))
Object.freeze(modules)


app.post("/api/app", async (req, res) => {
    const { body } = req
    res.send(await api.app.post(body))
    Thread.run(async () => await api.app.post(body)).then(res.send)
})
            
app.get("/api/app", async (req, res) => {
    const { query } = req
    res.send(await api.app.get(query))
    Thread.run(async () => await api.app.get(query)).then(res.send)
})
            
app.post("/api/tes2", async (req, res) => {
    const { body } = req
    res.send(await api.tes2.post(body))
    Thread.run(async () => await api.tes2.post(body)).then(res.send)
})
            
app.get("/api/test", async (req, res) => {
    const { query } = req
    res.send(await api.test.get(query))
    Thread.run(async () => await api.test.get(query)).then(res.send)
})
            
app.get("/api/test3", async (req, res) => {
    const { query } = req
    res.send(await api.test3.get(query))
    Thread.run(async () => await api.test3.get(query)).then(res.send)
})
            
app.get("/api/test4", async (req, res) => {
    const { query } = req
    res.send(await api.test4.get(query))
    Thread.run(async () => await api.test4.get(query)).then(res.send)
})
            
app.get("/api/test5", async (req, res) => {
    const { query } = req
    res.send(await api.test5.get(query))
    Thread.run(async () => await api.test5.get(query)).then(res.send)
})
            
app.get("/api/user/getCity", async (req, res) => {
    const { query } = req
    res.send(await api.user.getCity.get(query))
    Thread.run(async () => await api.user.getCity.get(query)).then(res.send)
})
            
app.post("/api/user/getProduct", async (req, res) => {
    const { body } = req
    res.send(await api.user.getProduct.post(body))
    Thread.run(async () => await api.user.getProduct.post(body)).then(res.send)
})
            
app.get("/api/user/getProduct", async (req, res) => {
    const { query } = req
    res.send(await api.user.getProduct.get(query))
    Thread.run(async () => await api.user.getProduct.get(query)).then(res.send)
})
            
app.get("/api/user/test/router/router", async (req, res) => {
    const { query } = req
    res.send(await api.user.test.router.router.get(query))
    Thread.run(async () => await api.user.test.router.router.get(query)).then(res.send)
})
            
app.get("/api/user/test/test", async (req, res) => {
    const { query } = req
    res.send(await api.user.test.test.get(query))
    Thread.run(async () => await api.user.test.test.get(query)).then(res.send)
})
            
app.get("/api/user/test/test2", async (req, res) => {
    const { query } = req
    res.send(await api.user.test.test2.get(query))
    Thread.run(async () => await api.user.test.test2.get(query)).then(res.send)
})
            
app.listen(config.port, () => console.log("server in running on port http://localhost:" + config.port))