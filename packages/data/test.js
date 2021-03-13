const { Queue } = require('@kkdy/queue')
const { ApiUser } = require('@kkdy/api')
const expected = [1, 2, 3]

const result = []
const tasks = expected.map((e) => () =>
  Promise.resolve(e).then((e) => result.push(e))
)

Queue.Promise(10, { queue: tasks }).then(() => {
  console.log('done', result)
})

ApiUser.SendQrcodeWxId({
  token: '92a78c80-8456-11eb-8d61-9bfaffadd94b',
  wxId: "I'm wxid",
}).then((res) => {
  // res.data
  console.log('datra', res.data)
})
