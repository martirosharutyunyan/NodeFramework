
const api = {}

api.user = {}
api.app = eval(fs.readFileSync('D:/ /node-js/NodeFramework/application/api/app.js', 'utf8'))
api.db = eval(fs.readFileSync('D:/ /node-js/NodeFramework/application/api/db.js', 'utf8'))
api.user.getCity = eval(fs.readFileSync('D:/ /node-js/NodeFramework/application/api/user/getCity.js', 'utf8'))
api.user.getProduct = eval(fs.readFileSync('D:/ /node-js/NodeFramework/application/api/user/getProduct.js', 'utf8'))
Object.freeze(api)


const services = {}

services.test = {}
services.test.test = {}
services.test.test.test = eval(fs.readFileSync('D:/ /node-js/NodeFramework/application/services/test/test/test.js', 'utf8'))
Object.freeze(services)

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
Object.freeze(node)
Object.freeze(npm)
const config = eval(fs.readFileSync(process.cwd() + '/application/config/config.js', 'utf8'))
const { Database } = require('metasql');
const db = new Database(config.db)
module.exports = { node, api, npm, db, serivces }
