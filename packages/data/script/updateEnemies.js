//@ts-check
const { Queue } = require('@kkdy/queue')
const { enemyInfo } = require('./template/enemyTemplate')
const { instance } = require('./instance')

async function updateEnemies() {
  const enemyInfos = require('../ArknightsGameData/zh_CN/gamedata/excel/enemy_handbook_table.json')
  const enemies = require('../ArknightsGameData/zh_CN/gamedata/levels/enemydata/enemy_database.json')
    .enemies
  const q = Queue.of(12)
  Object.values(enemies).forEach((data) => {
    q.pushTask(() => {
      /**
       * @type {import('../lib/EnemyInfo').IInfo}
       */
      let info = enemyInfos[data.Key]
      if (!info) {
        console.error('key', data.Key)
        info = enemyInfo()

        /**
         * @type {import('../lib/EnemyData').Value}
         */
        const value = data.Value[0]
        info.name = value.enemyData.name.m_value //[0].name.
        info.description = value.enemyData.description.m_value //[0].name.
        info.enemyId = data.Key
      }
      return instance
        .post('/update/enemy', { data, info })
        .then((e) => console.log('push', info.name))
    })
  })
  await q.allDone()
}

module.exports = {
  updateEnemies,
}
