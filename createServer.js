const fs = require('fs');
const path = require('path');
const methods = ['get', 'post']
const { exec } = require('child_process')

const getGlobalVariables = () => {
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
    return { node, npm };
}

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
const modulPath = process.cwd() + '\\application\\services'

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
        const paths = result.map(e => e.split("\\").join('/')).filter(interface => {
            if(interface.includes('.map')) {
                fs.promises.unlink(interface).catch(() => {}) 
                return false;
            }
            return true;
        })
        res(paths)
    })
})

const api = async () => {
    let str = ''
    const data = await getFiles(apiPath)
    const router = data.map(interface => ({ path: interface, interface: interface.split('application')[1].slice(0, -3).split('/').filter(e => e).join('.') }))
    const folder = folders(apiPath)
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
const services = async () => {
    let str = ''
    const data = await getFiles(modulPath)
    const folder = folders(modulPath).filter(e => e.includes('application\\services'))
    const router = data.map(interface => ({ path: interface, interface: interface.split('application')[1].slice(0, -3).split('/').filter(e => e).join('.') }))
    folder.map(e => e.split('\\application')[1].split('\\').filter(e => e).join('.')).forEach(path => {
        str += `\n${path} = {}` 
    })
    router.map(({ path, interface }) => {
        str += `\n${interface} = eval(fs.readFileSync('${path}', 'utf8'))`
    })
    return `
const services = {}
${str}
Object.freeze(services)
`
}

const express = async application => {
    const data = await api()
    const modul = await services()
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
${data}
${modul}
${application}
app.listen(config.port, () => console.log("server in running on port http://localhost:" + config.port))`
}



const frontConnection = async () => {
    let str = `module.exports = axios => {`
    const data = await getFiles(apiPath)
    const router = data.map(interface => ({ path: interface.split('application')[1].slice(0, -3), interface: interface.split('application')[1].slice(0, -3).split('/').filter(e => e).join('.') }))
    const folder = folders(apiPath)
    folder.map(e => e.split('\\application')[1].split('\\').filter(e => e).join('.')).forEach(path => {
        str += `\n    ${path} = {}` 
    })
    router.map(({ path, interface }) => {
        str += `
    ${interface} = {}
    ${interface}.get = async params => (await axios.get(\\\`${path}?$\\\{parse(params)}\\\`)).data
    ${interface}.post = async params => (await axios.post("${path}", params)).data`
    })
    return `
    ${str}
    return Object.freeze(api)
}
`
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
//        })
//    })
//    const expressApp = await express(application)
//    fs.writeFileSync(process.cwd() + '/server.js', expressApp, err => {}) 
//    return expressApp
// }
                    
// createServer2()
            

const globalts = async () => {
    const apiStr = await api()
    const servicesStr = await services()
    let application = 'import { Database } from "metasql"\n'
    const { node, npm } = getGlobalVariables()
    const getType = obj => JSON.stringify(eval(obj), null, 8).split('').filter(e => e === '"' ? '' : e).join('')
        .split('{}').join('{ get: Function, post: Function }')
    const dependencies = [...Object.keys(node), ...Object.keys(npm)].forEach(modul => {
        if(modul === 'process') return ;
        application += `import ${modul} from "${modul}"\n`
    })
    application += `declare global {\n`
    let nodeStr = '    const node: {'
    let npmStr = '    const npm: {'
    let apiString = `    const api: ${getType(apiStr)}`
    let servicesString = `    const services: ${getType(servicesStr)}`
    Object.keys(node).forEach(modul => {
        nodeStr += `\n        ${modul}: typeof ${modul}`
    })
    nodeStr += '\n    }'
    Object.keys(npm).forEach(modul => {
        npmStr += `\n        ${modul}: typeof ${modul}`
    })
    npmStr += '\n    }'
    const app = `${application}
${nodeStr}
${npmStr}
${apiString}
${servicesString}
    const db: Database
    
}`;
    fs.writeFileSync('./global.d.ts', app)
};


const createServer = async () => {
    const data = await getFiles(apiPath)
    const front = await frontConnection()
    let application = `
app.get('/api/connection', (req, res) => res.send(\`${front}\`))
    `
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
    try {
        const { ${body} } = req
        res.send(await ${callback}.${request}(${body}))
    } catch(e) {
        res.send(new Error(e))
    }
})
            `
        })
    })
    globalts()
    const expressApp = await express(application)
    return expressApp
}

createServer().then(res => eval(res))


