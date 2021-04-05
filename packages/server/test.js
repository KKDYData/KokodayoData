const { ReJSON } = require('redis-modules-sdk')
const { v5, v1 } = require('uuid')

const client = new ReJSON({
  port: 6379, // Redis port
  host: '0.0.0.0', // Redis host
  family: 4, // 4 (IPv4) or 6 (IPv6)
  keyPrefix: 'kkdy:',
  db: 2,
})
const NAME_SPACE = v1()
const id = v5('test', NAME_SPACE)
const id2 = v5('test', NAME_SPACE)
console.log(id, id2, id === id2)

return
;(async () => {
  const ok = await client.set('foo', '.', JSON.stringify({ bar: { a: 1 } }))
  console.log('ok', ok)
  const data = await client.get('foo', '.')
  console.log('data', data)
})()
