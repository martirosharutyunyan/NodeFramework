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
const { fs, vm } = node;
const { typeorm } = npm; 
const { getRepository } = typeorm

function getScript(string) {
    return new vm.Script(string).runInThisContext();
}

const fastify = require('fastify')({ logger: true });
const config = getScript(fs.readFileSync(process.cwd() + '/application/config/config.js', 'utf8'));
const { createConnection } = typeorm;

createConnection().then(() => {

    

const api = {};

api.user = {}
api.app = getScript(fs.readFileSync('D:/ /node-js/NodeFramework/application/api/app.js', 'utf8'))
api.db = getScript(fs.readFileSync('D:/ /node-js/NodeFramework/application/api/db.js', 'utf8'))
api.user.getCity = getScript(fs.readFileSync('D:/ /node-js/NodeFramework/application/api/user/getCity.js', 'utf8'))
api.user.getProduct = getScript(fs.readFileSync('D:/ /node-js/NodeFramework/application/api/user/getProduct.js', 'utf8'))
Object.freeze(api);


const services = {};

services.test = {}
services.test.test = {}
services.test.test.test = getScript(fs.readFileSync('D:/ /node-js/NodeFramework/application/services/test/test/test.js', 'utf8'))
services.test.test.test2 = getScript(fs.readFileSync('D:/ /node-js/NodeFramework/application/services/test/test/test2.js', 'utf8'))
Object.freeze(services);


fastify.get('/api/connection', (req, res) => res.send(`
    module.exports = axios => {
    api.user = {}
    api.app = {};
    api.app.get = async params => (await axios.get(\`/api/app?$\{parse(params)}\`)).data;
    api.app.post = async params => (await axios.post("/api/app", params)).data;
    api.db = {};
    api.db.get = async params => (await axios.get(\`/api/db?$\{parse(params)}\`)).data;
    api.db.post = async params => (await axios.post("/api/db", params)).data;
    api.user.getCity = {};
    api.user.getCity.get = async params => (await axios.get(\`/api/user/getCity?$\{parse(params)}\`)).data;
    api.user.getCity.post = async params => (await axios.post("/api/user/getCity", params)).data;
    api.user.getProduct = {};
    api.user.getProduct.get = async params => (await axios.get(\`/api/user/getProduct?$\{parse(params)}\`)).data;
    api.user.getProduct.post = async params => (await axios.post("/api/user/getProduct", params)).data;
    return Object.freeze(api);
}
`))
    
fastify.post("/api/app", async (req, res) => {
    try {
        res.send(await api.app.post({ ...req.body, ...req.headers, ...req.query }))
    } catch(e) {
        res.send(new Error(e))
    }
})
            
fastify.get("/api/app", async (req, res) => {
    try {
        res.send(await api.app.get({ ...req.body, ...req.headers, ...req.query }))
    } catch(e) {
        res.send(new Error(e))
    }
})
            
fastify.post("/api/db", async (req, res) => {
    try {
        res.send(await api.db.post({ ...req.body, ...req.headers, ...req.query }))
    } catch(e) {
        res.send(new Error(e))
    }
})
            
fastify.get("/api/db", async (req, res) => {
    try {
        res.send(await api.db.get({ ...req.body, ...req.headers, ...req.query }))
    } catch(e) {
        res.send(new Error(e))
    }
})
            
fastify.get("/api/user/getCity", async (req, res) => {
    try {
        res.send(await api.user.getCity.get({ ...req.body, ...req.headers, ...req.query }))
    } catch(e) {
        res.send(new Error(e))
    }
})
            
fastify.post("/api/user/getProduct", async (req, res) => {
    try {
        res.send(await api.user.getProduct.post({ ...req.body, ...req.headers, ...req.query }))
    } catch(e) {
        res.send(new Error(e))
    }
})
            
fastify.get("/api/user/getProduct", async (req, res) => {
    try {
        res.send(await api.user.getProduct.get({ ...req.body, ...req.headers, ...req.query }))
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

Object.assign(global, { node, npm, services, api });
start();
})