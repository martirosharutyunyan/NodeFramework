const ax = require('axios')

const parse = params => Object.entries(params).map(([key, value]) => `${key}=${value}`).join('&')
const api = {}

const getApi = async () => (await ax.get('http://localhost:8888/api/connection')).data
new Promise(async res => {
    console.log(eval((await getApi())))
    res(eval(await getApi())(ax.create({ baseURL:'http://localhost:8888' })))
    console.log(await getApi())
}).then(res => window.api = res)


export default api