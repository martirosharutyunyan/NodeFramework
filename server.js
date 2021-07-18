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

node.childProcess = node['child_process'];
node.StringDecoder = node['string_decoder'];
node.perfHooks = node['perf_hooks'];
node.asyncHooks = node['async_hooks'];
node.worker = node['worker_threads'];
node.fsp = node.fs.promises;  
Object.freeze(node)
Object.freeze(npm)
const { fs } = node
const { express, morgan, cors } = npm 
const app = express();
app.use(cors())
app.use(morgan('dev'));
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


app.get('/api/connection', (req, res) => res.send(`
    module.exports = axios => {
    api.ddsa = {}
    api.user = {}
    api.user.test = {}
    api.user.test.router = {}
    api.app = {}
    api.app.get = async params => (await axios.get(\`/api/app?$\{parse(params)}\`)).data
    api.app.post = async params => (await axios.post("/api/app", params)).data
    api.tes2 = {}
    api.tes2.get = async params => (await axios.get(\`/api/tes2?$\{parse(params)}\`)).data
    api.tes2.post = async params => (await axios.post("/api/tes2", params)).data
    api.test = {}
    api.test.get = async params => (await axios.get(\`/api/test?$\{parse(params)}\`)).data
    api.test.post = async params => (await axios.post("/api/test", params)).data
    api.test3 = {}
    api.test3.get = async params => (await axios.get(\`/api/test3?$\{parse(params)}\`)).data
    api.test3.post = async params => (await axios.post("/api/test3", params)).data
    api.test4 = {}
    api.test4.get = async params => (await axios.get(\`/api/test4?$\{parse(params)}\`)).data
    api.test4.post = async params => (await axios.post("/api/test4", params)).data
    api.test5 = {}
    api.test5.get = async params => (await axios.get(\`/api/test5?$\{parse(params)}\`)).data
    api.test5.post = async params => (await axios.post("/api/test5", params)).data
    api.user.getCity = {}
    api.user.getCity.get = async params => (await axios.get(\`/api/user/getCity?$\{parse(params)}\`)).data
    api.user.getCity.post = async params => (await axios.post("/api/user/getCity", params)).data
    api.user.getProduct = {}
    api.user.getProduct.get = async params => (await axios.get(\`/api/user/getProduct?$\{parse(params)}\`)).data
    api.user.getProduct.post = async params => (await axios.post("/api/user/getProduct", params)).data
    api.user.test.router.router = {}
    api.user.test.router.router.get = async params => (await axios.get(\`/api/user/test/router/router?$\{parse(params)}\`)).data
    api.user.test.router.router.post = async params => (await axios.post("/api/user/test/router/router", params)).data
    api.user.test.test = {}
    api.user.test.test.get = async params => (await axios.get(\`/api/user/test/test?$\{parse(params)}\`)).data
    api.user.test.test.post = async params => (await axios.post("/api/user/test/test", params)).data
    api.user.test.test2 = {}
    api.user.test.test2.get = async params => (await axios.get(\`/api/user/test/test2?$\{parse(params)}\`)).data
    api.user.test.test2.post = async params => (await axios.post("/api/user/test/test2", params)).data
    return Object.freeze(api)
}
`))
    
app.post("/api/app", async (req, res) => {
    try {
        const { body } = req
        res.send(await api.app.post(body))
    } catch(e) {
        res.send(new Error(e))
    }
})
            
app.get("/api/app", async (req, res) => {
    try {
        const { query } = req
        res.send(await api.app.get(query))
    } catch(e) {
        res.send(new Error(e))
    }
})
            
app.post("/api/tes2", async (req, res) => {
    try {
        const { body } = req
        res.send(await api.tes2.post(body))
    } catch(e) {
        res.send(new Error(e))
    }
})
            
app.get("/api/test", async (req, res) => {
    try {
        const { query } = req
        res.send(await api.test.get(query))
    } catch(e) {
        res.send(new Error(e))
    }
})
            
app.get("/api/test3", async (req, res) => {
    try {
        const { query } = req
        res.send(await api.test3.get(query))
    } catch(e) {
        res.send(new Error(e))
    }
})
            
app.get("/api/test4", async (req, res) => {
    try {
        const { query } = req
        res.send(await api.test4.get(query))
    } catch(e) {
        res.send(new Error(e))
    }
})
            
app.get("/api/test5", async (req, res) => {
    try {
        const { query } = req
        res.send(await api.test5.get(query))
    } catch(e) {
        res.send(new Error(e))
    }
})
            
app.get("/api/user/getCity", async (req, res) => {
    try {
        const { query } = req
        res.send(await api.user.getCity.get(query))
    } catch(e) {
        res.send(new Error(e))
    }
})
            
app.post("/api/user/getProduct", async (req, res) => {
    try {
        const { body } = req
        res.send(await api.user.getProduct.post(body))
    } catch(e) {
        res.send(new Error(e))
    }
})
            
app.get("/api/user/getProduct", async (req, res) => {
    try {
        const { query } = req
        res.send(await api.user.getProduct.get(query))
    } catch(e) {
        res.send(new Error(e))
    }
})
            
app.get("/api/user/test/router/router", async (req, res) => {
    try {
        const { query } = req
        res.send(await api.user.test.router.router.get(query))
    } catch(e) {
        res.send(new Error(e))
    }
})
            
app.get("/api/user/test/test", async (req, res) => {
    try {
        const { query } = req
        res.send(await api.user.test.test.get(query))
    } catch(e) {
        res.send(new Error(e))
    }
})
            
app.get("/api/user/test/test2", async (req, res) => {
    try {
        const { query } = req
        res.send(await api.user.test.test2.get(query))
    } catch(e) {
        res.send(new Error(e))
    }
})
            
app.listen(config.port, () => console.log("server in running on port http://localhost:" + config.port))