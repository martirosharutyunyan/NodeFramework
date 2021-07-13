const fs = require('fs');
const path = require('path');
const config = eval(fs.readFileSync('./application/config/config.js', 'utf8'))
const node = { process };
const npm = {};

const system = ['util', 'child_process', 'worker_threads', 'os', 'v8', 'vm'];
const tools = ['path', 'url', 'string_decoder', 'querystring', 'assert'];
const streams = ['stream', 'fs', 'crypto', 'zlib', 'readline'];
const async = ['perf_hooks', 'async_hooks', 'timers', 'events'];
const network = ['dns', 'net', 'tls', 'http', 'https', 'http2', 'dgram'];
const internals = [...system, ...tools, ...streams, ...async, ...network];
const folders = []

const pkg = require(process.cwd() + '/package.json');
const dependencies = [...internals];
if (pkg.dependencies) dependencies.push(...Object.keys(pkg.dependencies));

for (const name of dependencies) {
  if (name === 'impress') continue;
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





const walk = (dir, done) => {
    let results = [];
    fs.readdir(dir, (err, list) => {
        if (err) return done(err);
        let i = 0;
        (function next() {
            let file = list[i++];
            if (!file) return done(null, results);
            file = path.resolve(dir, file);
            fs.stat(file, (err, stat) => {
                if(stat.isDirectory()) folders.push(file)
                if (stat && stat.isDirectory()) {
                    walk(file, (err, res) => {
                        results = results.concat(res);
                        next(); 
                    });
                    return;
                }
                results.push(file);
                next();
            });
        })();
    });
};

const getFiles = async () => new Promise((res, rej) => {
    walk('./application/api/', (err, result) => {
        if(err) console.log(err)
        const paths = result.map(e => e.split("\\").join('/'))
        res(paths)
    })
})


const express = args => {
    return `const express = require("express");
const morgan = require("morgan");
const app = express();
const fs = require('fs');
app.use(morgan(\`dev\`));
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}));
const node = require("./packages.js")
const config = eval(fs.readFileSync('./application/config/config.js', 'utf8'))

const { Database } = require('metasql');
const db = new Database(config.db)
${args.application}
app.listen(config.port, () => console.log("server in running on port http://localhost:" + config.port))`
}




const api = async () => {
    let str = ''
    const data = await getFiles()
    const router = data.map(interface => ({ path: interface, interface: interface.split('application')[1].slice(0, -3).split('/').filter(e => e).join('.') }))
    folders.map(e => e.split('\\application')[1].split('\\').filter(e => e).join('.')).forEach(path => {
        str += `\n${path} = {}` 
    })
    router.map(({ path, interface }) => {
        str += `\n${interface} = eval(fs.readFileSync('${path}', 'utf8'))`
    })
    
    return eval(`
const fs = require("fs")
const api = {}
${str}
module.exports = Object.freeze(api)
`)
}

const createServer = async () => {
    const data = await getFiles()
    const routers = data.map(interface => {
        return {rout:fs.readFileSync(interface, 'utf8'), interface:interface.split('application')[1].slice(0, -3)}
    })
    let application = ''
    routers.map(({ rout, interface }) => {
        Object.keys(eval(rout)).forEach(request => {
            const body = request === 'get' ? 'query' : 'body'
            console.log(interface)
            const func = `await (${eval(rout)[request].toString()})(${body})`;
            application += `
app.${request}("${interface}", async (req, res) => {
    const { ${body} } = req
    res.send(${func})
})`
        })
    })
    return application;
}



createServer().then(async res => {
    const expressApp = express({ port: config.port, application: res }) 
    fs.writeFile('./server.js', expressApp, err => {})
})

module.exports = { api: api()};

