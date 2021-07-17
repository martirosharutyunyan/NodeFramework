const fs = require('fs');
const path = require('path');

const methods = ['get', 'post', 'put', 'delete']

const flatten = lists => {
    return lists.reduce((a, b) => a.concat(b), []);
}

const getDirectories = srcpath => {
    return fs.readdirSync(srcpath)
    .map(file => path.join(srcpath, file))
    .filter(path => fs.statSync(path).isDirectory());
}

const getDirectoriesRecursive = srcpath => {
    return [srcpath, ...flatten(getDirectories(srcpath).map(getDirectoriesRecursive))];
}

const apiPath = process.cwd() + '\\application\\api'
const modulPath = process.cwd() + '\\application\\modules'

const folders = path => getDirectoriesRecursive(path).filter(e => e !== path)


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



const getFiles = async path => new Promise(res => {
    walk(path, (err, result) => {
        if(err) console.log(err)
        const paths = result.map(e => e.split("\\").join('/'))
        res(paths)
    })
})


const api = async () => {
    let str = ''
    const data = await getFiles(apiPath)
    const router = data.map(interface => ({ path: interface, interface: interface.split('application')[1].slice(0, -3).split('/').filter(e => e).join('.') }))
    const folder = folders(apiPath).filter(e => e.includes('application\\api'))
    folder.map(e => e.split('\\application')[1].split('\\').filter(e => e).join('.')).forEach(path => {
        str += `\n${path} = {}` 
    })
    router.map(({ path, interface }) => {
        str += `\n${interface} = eval(fs.readFileSync('${path}', 'utf8'))`
    })
    return `
const api = {}
${str}
Object.freeze(api)
`
}
const modules = async () => {
    let str = ''
    const data = await getFiles(modulPath)
    const folder = folders(modulPath).filter(e => e.includes('application\\modules'))
    const router = data.map(interface => ({ path: interface, interface: interface.split('application')[1].slice(0, -3).split('/').filter(e => e).join('.') }))
    folder.map(e => e.split('\\application')[1].split('\\').filter(e => e).join('.')).forEach(path => {
        str += `\n${path} = {}` 
    })
    router.map(({ path, interface }) => {
        str += `\n${interface} = eval(fs.readFileSync('${path}', 'utf8'))`
    })
    return `
const modules = {}
${str}
Object.freeze(modules)
`
}

const express = async application => {
    const data = await api()
    const modul = await modules()
    return `const node = { process };
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
const { express, morgan } = npm 
const app = express();
app.use(morgan('dev'));
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}));
const config = eval(fs.readFileSync(process.cwd() + '/application/config/config.js', 'utf8'))
const { Database } = require('metasql');
const db = new Database(config.db)
${data}
${modul}
${application}
app.listen(config.port, () => console.log("server in running on port http://localhost:" + config.port))`
}





// const createServer2 = async () => {
//     const data = await getFiles(apiPath)
//     const routers = data.map(interface => {
//         return { rout: eval(fs.readFileSync(interface, 'utf8')), interface:interface.split('application')[1].slice(0, -3) }
//     })
//     let application = ''
//     routers.map(({ rout, interface }) => {
//         Object.keys(rout).forEach(request => {
//             if(!methods.includes(request)) return 
//             const body = request === 'get' ? 'query' : 'body'
//             const func = `await (${rout[request].toString()})(${body})`;
//             application += `
// app.${request}("${interface}", async (req, res) => {
//     const { ${body} } = req
//     res.send(${func})
// })`
// })
// })
//    const expressApp = await express(application)
//    fs.writeFileSync(process.cwd() + '/server.js', expressApp, err => {}) 
//    return expressApp
// }

// createServer2()

const createServer = async () => {
    const data = await getFiles(apiPath)
    let application = ''
    const routers = data.map(interface => ({
        callback: interface.split('application')[1].slice(0, -3).split('/').filter(e => e).join('.'),
        interface: interface.split('application')[1].slice(0, -3),
        rout: eval(fs.readFileSync(interface, 'utf8'))
    }))
    routers.forEach(({ rout, interface, callback }) => {
        Object.keys(rout).forEach(request => {
            if(!methods.includes(request)) return 
            const body = request === 'get' ? 'query' : 'body'
            application += `
app.${request}("${interface}", async (req, res) => {
    const { ${body} } = req
    res.send(await ${callback}.${request}(${body}))
})
            `
        })
    })
    const expressApp = await express(application)
    return expressApp
}

createServer().then(res => eval(res))
