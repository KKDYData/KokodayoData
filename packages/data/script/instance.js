const { default: Axios } = require('axios')

const instance = Axios.create({
  timeout: 1000000,
  baseURL: 'https://test.api.kokodayo.fun',
  // baseURL: 'http://127.0.0.1:7001',
})

module.exports = {
  instance,
}
