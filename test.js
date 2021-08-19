const vm = require('vm');
const fs = require('fs');
function getScript(string) {
    return new vm.Script(string).runInThisContext();
}
const config = getScript(fs.readFileSync(process.cwd() + '/application/typeorm/user.js', 'utf8'));
console.log(config)