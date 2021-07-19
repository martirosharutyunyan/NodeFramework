var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var _this = this;
var fs = require('fs');
var path = require('path');
var methods = ['get', 'post'];
var exec = require('child_process').exec;
var getGlobalVariables = function () {
    var node = { process: process };
    var npm = {};
    var system = ['util', 'child_process', 'worker_threads', 'os', 'v8', 'vm'];
    var tools = ['path', 'url', 'string_decoder', 'querystring', 'assert'];
    var streams = ['stream', 'fs', 'crypto', 'zlib', 'readline'];
    var async = ['perf_hooks', 'async_hooks', 'timers', 'events'];
    var network = ['dns', 'net', 'tls', 'http', 'https', 'http2', 'dgram'];
    var internals = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], system), tools), streams), async), network);
    var pkg = require(process.cwd() + '/package.json');
    var dependencies = __spreadArray([], internals);
    if (pkg.dependencies)
        dependencies.push.apply(dependencies, Object.keys(pkg.dependencies));
    for (var _i = 0, dependencies_1 = dependencies; _i < dependencies_1.length; _i++) {
        var name_1 = dependencies_1[_i];
        var lib = null;
        try {
            lib = require(name_1);
        }
        catch (_a) {
            continue;
        }
        if (internals.includes(name_1)) {
            node[name_1] = lib;
            continue;
        }
        npm[name_1] = lib;
    }
    Object.freeze(node);
    Object.freeze(npm);
    return { node: node, npm: npm };
};
var flatten = function (lists) {
    return lists.reduce(function (a, b) { return a.concat(b); }, []);
};
var getDirectories = function (srcpath) {
    return fs.readdirSync(srcpath)
        .map(function (file) { return path.join(srcpath, file); })
        .filter(function (path) { return fs.statSync(path).isDirectory(); });
};
var getDirectoriesRecursive = function (srcpath) {
    return __spreadArray([srcpath], flatten(getDirectories(srcpath).map(getDirectoriesRecursive)));
};
var apiPath = process.cwd() + '\\application\\api';
var modulPath = process.cwd() + '\\application\\services';
var folders = function (path) { return getDirectoriesRecursive(path).filter(function (e) { return e !== path; }); };
var walk = function (dir, done) {
    var results = [];
    fs.readdir(dir, function (err, list) {
        if (err)
            return done(err);
        var i = 0;
        (function next() {
            var file = list[i++];
            if (!file)
                return done(null, results);
            file = path.resolve(dir, file);
            fs.stat(file, function (err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function (err, res) {
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
var getFiles = function (path) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2, new Promise(function (res) {
                walk(path, function (err, result) {
                    if (err)
                        console.log(err);
                    var paths = result.map(function (e) { return e.split("\\").join('/'); }).filter(function (interface) {
                        if (interface.includes('.map')) {
                            fs.promises.unlink(interface).catch(function () { });
                            return false;
                        }
                        return true;
                    });
                    res(paths);
                });
            })];
    });
}); };
var api = function () { return __awaiter(_this, void 0, void 0, function () {
    var str, data, router, folder;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                str = '';
                return [4, getFiles(apiPath)];
            case 1:
                data = _a.sent();
                router = data.map(function (interface) { return ({ path: interface, interface: interface.split('application')[1].slice(0, -3).split('/').filter(function (e) { return e; }).join('.') }); });
                folder = folders(apiPath);
                folder.map(function (e) { return e.split('\\application')[1].split('\\').filter(function (e) { return e; }).join('.'); }).forEach(function (path) {
                    str += "\n" + path + " = {}";
                });
                router.map(function (_a) {
                    var path = _a.path, interface = _a.interface;
                    str += "\n" + interface + " = eval(fs.readFileSync('" + path + "', 'utf8'))";
                });
                return [2, "\nconst api = {}\n" + str + "\nObject.freeze(api)\n"];
        }
    });
}); };
var services = function () { return __awaiter(_this, void 0, void 0, function () {
    var str, data, folder, router;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                str = '';
                return [4, getFiles(modulPath)];
            case 1:
                data = _a.sent();
                folder = folders(modulPath).filter(function (e) { return e.includes('application\\services'); });
                router = data.map(function (interface) { return ({ path: interface, interface: interface.split('application')[1].slice(0, -3).split('/').filter(function (e) { return e; }).join('.') }); });
                folder.map(function (e) { return e.split('\\application')[1].split('\\').filter(function (e) { return e; }).join('.'); }).forEach(function (path) {
                    str += "\n" + path + " = {}";
                });
                router.map(function (_a) {
                    var path = _a.path, interface = _a.interface;
                    str += "\n" + interface + " = eval(fs.readFileSync('" + path + "', 'utf8'))";
                });
                return [2, "\nconst services = {}\n" + str + "\nObject.freeze(services)\n"];
        }
    });
}); };
var express = function (application) { return __awaiter(_this, void 0, void 0, function () {
    var data, modul;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, api()];
            case 1:
                data = _a.sent();
                return [4, services()];
            case 2:
                modul = _a.sent();
                return [2, "const node = { process };\nconst npm = {};\n    \nconst system = ['util', 'child_process', 'worker_threads', 'os', 'v8', 'vm'];\nconst tools = ['path', 'url', 'string_decoder', 'querystring', 'assert'];\nconst streams = ['stream', 'fs', 'crypto', 'zlib', 'readline'];\nconst async = ['perf_hooks', 'async_hooks', 'timers', 'events'];\nconst network = ['dns', 'net', 'tls', 'http', 'https', 'http2', 'dgram'];\nconst internals = [...system, ...tools, ...streams, ...async, ...network];\n\nconst pkg = require(process.cwd() + '/package.json');\nconst dependencies = [...internals];\nif (pkg.dependencies) dependencies.push(...Object.keys(pkg.dependencies));\n\nfor (const name of dependencies) {\n  let lib = null;\n  try {\n      lib = require(name);\n  } catch {\n      continue;\n  }\n  if (internals.includes(name)) {\n    node[name] = lib;\n    continue;\n  }\n  npm[name] = lib;\n}\n\n\nObject.freeze(node)\nObject.freeze(npm)\nconst { fs } = node\nconst { express, morgan, cors } = npm \nconst app = express();\napp.use(cors())\napp.use(morgan('dev'));\napp.use(express.json())\napp.use(express.urlencoded({\n    extended: false\n}));\nconst config = eval(fs.readFileSync(process.cwd() + '/application/config/config.js', 'utf8'))\nconst { Database } = require('metasql');\nconst db = new Database(config.db)\n" + data + "\n" + modul + "\n" + application + "\napp.listen(config.port, () => console.log(\"server in running on port http://localhost:\" + config.port))"];
        }
    });
}); };
var frontConnection = function () { return __awaiter(_this, void 0, void 0, function () {
    var str, data, router, folder;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                str = "module.exports = axios => {";
                return [4, getFiles(apiPath)];
            case 1:
                data = _a.sent();
                router = data.map(function (interface) { return ({ path: interface.split('application')[1].slice(0, -3), interface: interface.split('application')[1].slice(0, -3).split('/').filter(function (e) { return e; }).join('.') }); });
                folder = folders(apiPath);
                folder.map(function (e) { return e.split('\\application')[1].split('\\').filter(function (e) { return e; }).join('.'); }).forEach(function (path) {
                    str += "\n    " + path + " = {}";
                });
                router.map(function (_a) {
                    var path = _a.path, interface = _a.interface;
                    str += "\n    " + interface + " = {}\n    " + interface + ".get = async params => (await axios.get(\\`" + path + "?$\\{parse(params)}\\`)).data\n    " + interface + ".post = async params => (await axios.post(\"" + path + "\", params)).data";
                });
                return [2, "\n    " + str + "\n    return Object.freeze(api)\n}\n"];
        }
    });
}); };
var createServer = function () { return __awaiter(_this, void 0, void 0, function () {
    var data, front, application, routers, expressApp;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, getFiles(apiPath)];
            case 1:
                data = _a.sent();
                return [4, frontConnection()];
            case 2:
                front = _a.sent();
                application = "\napp.get('/api/connection', (req, res) => res.send(`" + front + "`))\n    ";
                routers = data.map(function (interface) { return ({
                    callback: interface.split('application')[1].slice(0, -3).split('/').filter(function (e) { return e; }).join('.'),
                    interface: interface.split('application')[1].slice(0, -3),
                    rout: eval(fs.readFileSync(interface, 'utf8'))
                }); });
                routers.forEach(function (_a) {
                    var rout = _a.rout, interface = _a.interface, callback = _a.callback;
                    Object.keys(rout).forEach(function (request) {
                        if (!methods.includes(request))
                            return;
                        var body = request === 'get' ? 'query' : 'body';
                        application += "\napp." + request + "(\"" + interface + "\", async (req, res) => {\n    try {\n        const { " + body + " } = req\n        res.send(await " + callback + "." + request + "(" + body + "))\n    } catch(e) {\n        res.send(new Error(e))\n    }\n})\n            ";
                    });
                });
                return [4, express(application)];
            case 3:
                expressApp = _a.sent();
                return [2, expressApp];
        }
    });
}); };
createServer().then(function (res) { return eval(res); });
var globalts = function () {
    var application = 'import { Database } from "metasql"\n';
    var _a = getGlobalVariables(), node = _a.node, npm = _a.npm;
    var dependencies = __spreadArray(__spreadArray([], Object.keys(node)), Object.keys(npm)).forEach(function (modul) {
        if (modul === 'process')
            return;
        application += "import " + modul + " from \"" + modul + "\"\n";
    });
    application += "declare global {\n";
    var nodeStr = '    const node: {';
    var npmStr = '    const npm: {';
    Object.keys(node).forEach(function (modul) {
        nodeStr += "\n        " + modul + ": typeof " + modul;
    });
    nodeStr += '\n    }';
    Object.keys(npm).forEach(function (modul) {
        npmStr += "\n        " + modul + ": typeof " + modul;
    });
    npmStr += '\n    }';
    var app = application + "\n" + nodeStr + "\n" + npmStr + "\n    const db: Database\n}";
    fs.writeFileSync('./global.d.ts', app);
};
globalts();
//# sourceMappingURL=createServer.js.map