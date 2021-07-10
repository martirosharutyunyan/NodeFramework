const fs = require('fs');
const path = require('path');
const { exec } = require('child_process')
const config = eval(fs.readFileSync('./application/config/config.js', 'utf8'))


const { Database } = require('metasql')
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


exec('git init', console.log)



// const express = require("express");
// const morgan = require("morgan");
// const app = express();
// app.use(morgan(`dev`));
// app.use(express.json())
// app.use(express.urlencoded({
//     extended: false
// }));
// app.listen(3000, () => console.log(`server in running on http://localhost:${port}`))

const createServer = async () => {
    const data = await getFiles()
    data.forEach(e => {
        const router = fs.readFileSync(e, 'utf8').split('\r\n').map(e => {
            const index = e.search('node')
            if(index === -1) return e;
            const str = e.split('.').find(e => {
                const x = e.search('node')
                if(x === -1) return true
                return false;
            })
            const modulIndex = e.search(str)
            const rq = `require("${str}")`
            return e.slice(0, 27) + rq + e.slice(modulIndex + str.length)
        }).join('\r\n')
        
    })
}

createServer()




