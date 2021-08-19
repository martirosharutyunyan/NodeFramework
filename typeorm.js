const typeorm = require('typeorm')

const array = Object.keys(typeorm).map(elem => ({ variableName: elem, typeName: elem.slice(0, -1) }))

let str = 'import {'


array.forEach(({ variableName, typeName }) => {
    str += `${variableName} as ${typeName},\n`
})

str += '} from \'typeorm\'\n'


str += 'declare global {';

array.forEach(({ variableName, typeName }) => {
    str += `const ${variableName}: typeof ${typeName}\n`
})

str += '}'

require('fs').writeFileSync('./test.ts', str)
