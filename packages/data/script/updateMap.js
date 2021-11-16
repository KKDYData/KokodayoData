//@ts-check
const path = require('path')
const { Queue } = require('@kkdy/queue')
const { instance } = require('./instance')
const fs = require('fs')

async function updateActMap(root, filter = '') {
  const lvs = fs.readdirSync(path.resolve(__dirname, root))
  const q = Queue.of(12)
  lvs.forEach((subp) => {
    const son = fs.readdirSync(path.resolve(__dirname, path.join(root, subp)))
    if (filter && ![filter].includes(subp)) {
      return
    }

    son.forEach((p) => {
      const levelId = p.slice(0, -5)
      q.pushTask(() => {
        const map = JSON.parse(
          fs.readFileSync(
            path.resolve(__dirname, path.join(root, subp, `/${levelId}.json`)),
            {
              encoding: 'utf-8',
            }
          )
        )
        return instance
          .post('/update/map', {
            levelId,
            data: map,
          })
          .then((e) => console.log('push', levelId))
      })
    })
  })
  await q.allDone()
}

async function updateStageInfo(filter = '') {
  const infos = require('../ArknightsGameData/zh_CN/gamedata/excel/stage_table.json')
  const q = Queue.of(12)
  Object.values(infos.stages)
    .filter((e) => e.levelId && e.levelId.indexOf(filter) > -1)
    .forEach((info) => {
      const levelId = info.levelId.split('/').pop()
      q.pushTask(
        () =>
          instance
            .post('/update/map/info', {
              levelId,
              info,
            })
            .then((res) => {
              if (res.data.code) console.error(res.data)
              else console.log('done ', levelId)
            })
        // .catch((err) => console.error('err', levelId, err))
      )
    })

  await q.allDone()
}

module.exports = {
  updateActMap,
  updateStageInfo,
}
