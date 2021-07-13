const fs = require('fs');
const path = require('path');
const config = eval(fs.readFileSync('./application/config/config.js', 'utf8'))




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




const createServer = async () => {
    const data = await getFiles()
    const routers = data.map(interface => {
        return {rout:fs.readFileSync(interface, 'utf8').split('\r\n'), interface:interface.split('application')[1].slice(0, -3)}
    })
    let application = ''
    routers.map(({ rout, interface }) => {
        Object.keys(eval(rout.join('\r\n'))).forEach(request => {
            const body = request === 'get' ? 'query' : 'body'
            const func = `await (${eval(rout.join('\r\n'))[request].toString()})(${body})`;
            application += `
app.${request}("${interface}", async (req, res) => {
    const { ${body} } = req
    res.send(${func})
})
            `
        })
    })
    return application;
}

createServer().then(async res => {
    const expressApp = express({ port: config.port, application:res }) 
    fs.writeFile('./server.js', expressApp, err => {})
})



