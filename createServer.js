const fs = require('fs');
const path = require('path');
const config = eval(fs.readFileSync('./application/config/config.js', 'utf8'))

const { Database } = require('metasql');
const db = new Database(config.db)


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

const getFiles = async () => new Promise((res, rej) => {
    walk('./application/api/', (err, result) => {
        const paths = result.map(e => e.split("\\").join('/'))
        res(paths)
    })
})


const express = args => {
    return `const express = require("express");
const morgan = require("morgan");
const app = express();
const fs = require('fs');
const path = require('path');
app.use(morgan(\`dev\`));
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}));

const config = eval(fs.readFileSync('./application/config/config.js', 'utf8'))

const { Database } = require('metasql');
const db = new Database(config.db)
const { Database } = require('metasql');
const db = new Database()
${args.application}
app.listen(${args.port}, () => console.log("server in running on http://localhost:${args.port}"))`
}




const createServer = async () => {
    const data = await getFiles()
    const routers = data.map(interface => {
        return {rout:fs.readFileSync(interface, 'utf8').split('\r\n').map(e => {
            const index = e.search('node')
            if(index === -1) return e;
            const str = e.split('.').find(e => {
                const x = e.search('node')
                if(x === -1) return true
                return false;
            })
            const modulIndex = e.search(str)
            const rq = `require("${str}")`
            return e.slice(0, index) + rq + e.slice(modulIndex + str.length)
        }), interface:interface.split('application')[1].slice(0, -3)}
    })
    let str = ''
    routers.map(({ rout, interface }) => {
        const [first, ...len] = rout
        
        const router = Object.keys(eval(rout.join('\r\n'))).map(request => {
            const body = request === 'get' ? 'query' : 'body'
            const func = `await (${eval(rout.join('\r\n'))[request].toString()})(${body})`;
            str += `
            app.${request}("${interface}", async (req, res) => {
                const { ${body} } = req
                res.send(${func})
            })
            `
        })
    })
    return str;
}

createServer().then(async res => {
    const expressApp = express({ port: config.port, application:res }) 
    fs.writeFile('./express.js', expressApp, err => {})
})



