const fs = require('fs')
const path = require('path')

const time = +new Date()

fs.writeFileSync(path.resolve(__dirname, '../script/ver.js'), `
const ver = '${time}'
module.exports = {
  ver
} `)


module.exports = {
  time
}
