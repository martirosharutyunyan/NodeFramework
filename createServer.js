const fs = require('fs');
const path = require('path');
const vm = require('vm');
const slash = process.platform === 'win32' ? '\\' : '/';
const methods = ['get', 'post', 'delete', 'put'];

function getScript(string) {
    return new vm.Script(string).runInThisContext();
}

const config = getScript(fs.readFileSync(process.cwd() + '/application/config/config.js', 'utf8'));

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
    Object.freeze(node);
    Object.freeze(npm);
    return { node, npm };
}

const flatten = lists => lists.reduce((a, b) => a.concat(b), []);

const getDirectories = srcpath => {
    return fs.readdirSync(srcpath)
    .map(file => path.join(srcpath, file))
    .filter(path => fs.statSync(path).isDirectory());
}

const getDirectoriesRecursive = srcpath => [srcpath, ...flatten(getDirectories(srcpath).map(getDirectoriesRecursive))];

const apiPath = process.cwd() + `${slash}application${slash}api`;
const modulPath = process.cwd() + `${slash}application${slash}services`;
const typeormPath = process.cwd() + `${slash}application${slash}typeorm`;

const folders = path => getDirectoriesRecursive(path).filter(e => e !== path);


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
        if(err) console.log(err);
        const paths = result.map(e => e.split(slash).join('/')).filter(interface => {
            if(interface.includes('.map')) {
                fs.promises.unlink(interface).catch(() => {}); 
                return false;
            }
            return true;
        })
        res(paths);
    })
})

const api = async () => {
    let str = '';
    const data = await getFiles(apiPath)
    const router = data.map(interface => ({ path: interface, interface: interface.split('application')[1].slice(0, -3).split('/').filter(e => e).join('.') }));
    const folder = folders(apiPath);
    folder.map(e => e.split(`${slash}application`)[1].split('\\').filter(e => e).join('.')).forEach(path => {
        str += `\n${path} = {}`; 
    })
    router.map(({ path, interface }) => {
        str += `\n${interface} = getScript(fs.readFileSync('${path}', 'utf8'))`;
    })
    return `
const api = {};
${str}
Object.freeze(api);
`
}
const services = async () => {
    let str = '';
    const data = await getFiles(modulPath);
    const folder = folders(modulPath).filter(e => e.includes(`application${slash}services`));
    const router = data.map(interface => ({ path: interface, interface: interface.split('application')[1].slice(0, -3).split('/').filter(e => e).join('.') }));
    folder.map(e => e.split(`${slash}application`)[1].split('\\').filter(e => e).join('.')).forEach(path => {
        str += `\n${path} = {}`;
    })
    router.map(({ path, interface }) => {
        str += `\n${interface} = getScript(fs.readFileSync('${path}', 'utf8'))`;
    })
    return `
const services = {};
${str}
Object.freeze(services);
`
}

const fastify = async application => {
    const data = await api();
    const modul = await services();
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

    
${data}
${modul}
${application}
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
})`
}



const frontConnection = async () => {
    let str = `module.exports = axios => {`;
    const data = await getFiles(apiPath);
    const router = data.map(interface => ({ path: interface.split('application')[1].slice(0, -3), interface: interface.split('application')[1].slice(0, -3).split('/').filter(e => e).join('.') }));
    const folder = folders(apiPath);
    folder.map(e => e.split(`${slash}application`)[1].split(slash).filter(e => e).join('.')).forEach(path => {
        str += `\n    ${path} = {}`; 
    })
    router.map(({ path, interface }) => {
        str += `
    ${interface} = {};
    ${interface}.get = async params => (await axios.get(\\\`${path}?$\\\{parse(params)}\\\`)).data;
    ${interface}.post = async params => (await axios.post("${path}", params)).data;`
    })
    return `
    ${str}
    return Object.freeze(api);
}
`
}          

const generateTypeormEntities = async () => {
    fs.existsSync(process.cwd() + '/application/typeorm-entities') || fs.mkdirSync(process.cwd() + '/application/typeorm-entities');
    const data = await getFiles(typeormPath);
    const router = data.map(interface => ({ path: interface, interface: interface.split('typeorm')[1].slice(0, -3).split('/').filter(e => e).join('.') }));
    router.map(({ path, interface }) => {
        let str = `const vm = require('vm')
const fs = require('fs')
const { EntitySchema } = require('typeorm');
function getScript(string) {
    return new vm.Script(string).runInThisContext();
};
const staticEntity = {
    id: {
        type: 'int',
        primary: true,
        generated: true,
    },
    createdAt: {
        name: 'created_at',
        type: 'timestamp with time zone',
        createDate: true,
    },
    updatedAt: {
        name: 'updated_at',
        type: 'timestamp with time zone',
        updateDate: true,
    },
};
const entity = getScript(fs.readFileSync('${path}', 'utf8'));
entity.columns = { ...entity.columns, ...staticEntity}
const ${interface}Entity = new EntitySchema(entity)

module.exports = ${interface}Entity;
`
        fs.writeFileSync(process.cwd() + `/application/typeorm-entities/${interface}.js`, str)
    })
};

const typeorm = async () => {
    // generateTypeormEntities()
    const data = await getFiles(typeormPath);
    const router = data.map(interface => ({ path: interface.replace('typeorm', 'typeorm-entities'), interface: interface.split('typeorm')[1].slice(0, -3).split('/').filter(e => e).join('.') }));
    let str = `const db = {}`
    router.map(({ interface, path }) => {
        str += `\ndb.${interface} = getRepository(getScript(fs.readFile('${path}', 'utf8')))`
    })
    console.log(str)
}

typeorm()

const globalts = async () => {
    const apiStr = await api()
    const servicesStr = await services()
    let application = 'import { EntitySchemaOptions } from "typeorm/entity-schema/EntitySchemaOptions"\n'
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
    const confStr = `    const config : ${JSON.stringify(config, null, 2)}`
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
${confStr}
interface EntitySchema<T> extends EntitySchemaOptions<T> {}
}`;
    fs.writeFileSync(process.cwd() + '/global.d.ts', app)
};

const createServer = async () => {
    const data = await getFiles(apiPath)
    const front = await frontConnection()
    let application = `
fastify.get('/api/connection', (req, res) => res.send(\`${front}\`))
    `
    const routers = data.map(interface => ({
        callback: interface.split('application')[1].slice(0, -3).split('/').filter(e => e).join('.'),
        interface: interface.split('application')[1].slice(0, -3),
        rout: getScript(fs.readFileSync(interface, 'utf8'))
    }))
    routers.forEach(({ rout, interface, callback }) => {
        Object.keys(rout).forEach(request => {
            if(!methods.includes(request)) return 
            application += `
fastify.${request}("${interface}", async (req, res) => {
    try {
        res.send(await ${callback}.${request}({ ...req.body, ...req.headers, ...req.query }))
    } catch(e) {
        res.send(new Error(e))
    }
})
            `
        })
    })
    globalts()
    const fastifyApp = await fastify(application)
    fs.writeFileSync(process.cwd() + '/fastify.js', fastifyApp)
}

createServer()


