const node = { process };
const npm = {};
    
const system = ['util', 'child_process', 'worker_threads', 'os', 'v8', 'vm'];
const tools = ['path', 'url', 'string_decoder', 'querystring', 'assert'];
const streams = ['stream', 'fs', 'crypto', 'zlib', 'readline'];
const async = ['perf_hooks', 'async_hooks', 'timers', 'events'];
const network = ['dns', 'net', 'tls', 'http', 'https', 'http2', 'dgram'];
const internals = [...system, ...tools, ...streams, ...async, ...network];

const pkg = require(process.cwd() + '/package.json');
const dependencies = [...internals];
if (pkg.dependencies) dependencies.push(...Object.keys(pkg.dependencies));

for (const name of dependencies) {
  let lib = null;
  try {
      lib = require(name);
  } catch {
      continue;
  }
  if (internals.includes(name)) {
    node[name] = lib;
    continue;
  }
  npm[name] = lib;
}


Object.freeze(node);
Object.freeze(npm);
const { typeorm: { getRepository, createConnection } } = npm; 
const fastify = require('fastify')({ logger: true });
const config = require(process.cwd() + '/application/config/config.js');

createConnection({
    "type": "postgres",
    "database": "usersDB",
    "password": "hhs13516",
    "port": 5432,
    "host": "localhost",
    "username": "postgres",
    "entities": ["./application/typeorm-entities/*.js"],
    "migrations": ["./application/migrations/*.js"]
}).then(() => {
const db = {}
db.posts = getRepository(require('D:/ /node-js/NodeFramework/application/typeorm-entities/post.js'));
db.users = getRepository(require('D:/ /node-js/NodeFramework/application/typeorm-entities/user.js'));
    

const api = {};

api.post = require('D:/ /node-js/NodeFramework/application/api/post.js')
api.user = require('D:/ /node-js/NodeFramework/application/api/user.js')
Object.freeze(api);


const services = {};

services.test2 = require('D:/ /node-js/NodeFramework/application/services/test2.js')
Object.freeze(services);


fastify.get('/api/connection', (req, res) => res.send(`
    module.exports = axios => {
    api.post = {};
    api.post.get = async params => (await axios.get(\`/api/post?$\{parse(params)}\`)).data;
    api.post.post = async params => (await axios.post("/api/post", params)).data;
    api.user = {};
    api.user.get = async params => (await axios.get(\`/api/user?$\{parse(params)}\`)).data;
    api.user.post = async params => (await axios.post("/api/user", params)).data;
    return Object.freeze(api);
}
`))
    
fastify.get("/api/post", async (req, res) => {
    try {
        res.send(await api.post.get({ ...req.body, ...req.headers, ...req.query }))
    } catch(e) {
        res.send(new Error(e))
    }
})
            
fastify.post("/api/post", async (req, res) => {
    try {
        res.send(await api.post.post({ ...req.body, ...req.headers, ...req.query }))
    } catch(e) {
        res.send(new Error(e))
    }
})
            
fastify.delete("/api/post", async (req, res) => {
    try {
        res.send(await api.post.delete({ ...req.body, ...req.headers, ...req.query }))
    } catch(e) {
        res.send(new Error(e))
    }
})
            
fastify.get("/api/user", async (req, res) => {
    try {
        res.send(await api.user.get({ ...req.body, ...req.headers, ...req.query }))
    } catch(e) {
        res.send(new Error(e))
    }
})
            
fastify.post("/api/user", async (req, res) => {
    try {
        res.send(await api.user.post({ ...req.body, ...req.headers, ...req.query }))
    } catch(e) {
        res.send(new Error(e))
    }
})
            
fastify.delete("/api/user", async (req, res) => {
    try {
        res.send(await api.user.delete({ ...req.body, ...req.headers, ...req.query }))
    } catch(e) {
        res.send(new Error(e))
    }
})
            
const start = async () => {
    try {
        await fastify.listen(config.port);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
Object.assign(global, { db, services, api, node, npm  })
start();
})