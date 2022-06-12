//@ts-check

const { default: Axios } = require('axios')
const { Queue } = require('@kkdy/queue')
const fs = require('fs')
const path = require('path')
const { updateEnemies } = require('./updateEnemies')
const {
  updateActMap,
  updateStageInfo,
  updateRogueStageInfo,
} = require('./updateMap')

const { instance: ins } = require('./instance')

;(async () => {
  // const { data } = await ins.get('/')
  // await updateBuildingBuff()
  // await updateBuildingSkill()
  // await updateCharInfo()
  // await updateCharword()
  // await updateSkill()
  // await updatePatchInfo()
  // await updateTeamInfo()
  // await updateEquip()
  // await updateChars()
  // await updateAct()
  await updateGachaPool()
  const res = await ins.post('/update/gachaPool/name', {
    // startDate: new Date('2021/02/05 16:00:00'),
    // endDate: new Date('2021/02/19 03:59:59'),
    name: '不协和音程',
    chars: ['黑键', '濯尘芙蓉'],
  })
  // await updateEnemies()
  // await updateActMap(
  //   '../ArknightsGameData/zh_CN/gamedata/levels/activities/',
  //   'act17side'
  // )
  // await updateActMap(
  //   '../ArknightsGameData/zh_CN/gamedata/levels/obt',
  //   'hard',
  //   '9'
  // )
  // await updateActMap('../ArknightsGameData/zh_CN/gamedata/levels/obt/', 'rune')
  // await updateActMap(
  //   '../ArknightsGameData/zh_CN/gamedata/levels/obt/',
  //   'campaign'
  // )
  // await updateActMap(
  //   '../ArknightsGameData/zh_CN/gamedata/levels/obt/',
  //   'memory'
  // )

  // await updateActMap(
  //   '../ArknightsGameData/zh_CN/gamedata/levels/obt/',
  //   'weekly'
  // )

  // await updateRogueStageInfo('_n_')
  // await updateStageInfo('hard_09')
  // await updateStageInfo('act17side')
  // await updateStageInfo('camp')
  // await updateStageInfo('weekly')
  // return
  // const res = await ins.get('/data/map/list', {
  //   // id: 'char_1001_amiya2',
  //   params: {
  //     id: 'enemy_1058_traink',
  //   },
  // })
  // res.data.result.map((s) => console.log(s.levelId, s.stageInfos.length))
  // console.log(
  //   // res.data.result.stageEnemies.map((e) => e.stageLevelId)
  // )

  // const { data }
  return
  // const stages = require('./ArknightsGameData/zh_CN/gamedata/excel/stage_table.json')
  //   .stages
  // const map = require('./ArknightsGameData/zh_CN/gamedata/levels/obt/main/level_main_00-01.json')

  // // return
  // const res = await ins.post('/update/map', {
  //   // id: 'char_1001_amiya2',
  //   levelId: 'level_main_00-01',
  //   data: map,
  // })

  // const infoRes = await ins.post('/update/map/info', {
  //   levelId: 'level_main_00-01',
  //   info: stages['main_00-01'],
  // })
  // console.log('res.info', infoRes.data)

  // // const res
  // const { data: mapData } = await ins.get('/update/map', {
  //   params: { levelId: 'level_main_00-01' },
  // })
  // // const { data } = await getChar('char_1001_amiya2')
  // // const { data: skills } = await getSkill('skcom_atk_up[1]')
  // console.log('data', mapData)
  // console.log('skill', skills)
})()

async function updateBuildingBuff() {
  const hook_book =
    require('../ArknightsGameData/zh_CN/gamedata/excel/building_data.json').buffs

  const list = Object.values(hook_book)

  const queue = Queue.of(144)
  list.forEach((e, i) => {
    queue.pushTask(() =>
      ins.post('/update/buildingBuff', e).then(() => {
        console.log('buildingBuff', queue.total, queue.done)
      })
    )
  })

  await queue.allDone()
}

async function updateBuildingSkill() {
  const hook_book =
    require('../ArknightsGameData/zh_CN/gamedata/excel/building_data.json').chars

  const list = Object.values(hook_book)

  const queue = Queue.of(144)
  list.forEach((e, i) => {
    queue.pushTask(() =>
      ins.post('/update/buildingSkill', e).then(() => {
        console.log('buildingSkill', queue.total, queue.done)
      })
    )
  })

  await queue.allDone()
}

function updateCharInfo() {
  const hook_book =
    require('../ArknightsGameData/zh_CN/gamedata/excel/handbook_info_table.json').handbookDict

  const list = Object.values(hook_book)

  const queue = Queue.of(144)
  list.forEach((e) => {
    queue.pushTask(() =>
      ins.post('/update/charInfo', e).then(() => {
        console.log('charInfo', queue.total, queue.done)
      })
    )
  })

  return queue.allDone()
}

function updateSkill() {
  const skill_table = require('../ArknightsGameData/zh_CN/gamedata/excel/skill_table.json')
  const list = Object.values(skill_table)

  const queue = Queue.of(144)
  list.forEach((e) => {
    queue.pushTask(() =>
      ins.post('/update/skill', e).then(() => {
        console.log('skill', queue.total, queue.done)
      })
    )
  })
  return queue.allDone()
}

function updateCharword() {
  const charword_table = require('../ArknightsGameData/zh_CN/gamedata/excel/charword_table.json')
  const list = Object.values(charword_table.charWords)

  const queue = Queue.of(144)
  let errCount = 0
  list.forEach((e) => {
    queue.pushTask(() => {
      const task = () =>
        ins
          .post('/update/charword', e)
          .then(() => {
            console.log(
              'word',
              e.charWordId,
              queue.total,
              queue.done,
              queue.running
            )
          })
          .catch((err) => {
            console.error('err: ' + errCount++, e.charId, err.message)
            queue.pushTask(task)
          })
      return task()
    })
  })
  return queue.allDone()
}

function updateTeamInfo() {
  const team_table = require('../ArknightsGameData/zh_CN/gamedata/excel/handbook_team_table.json')
  const list = Object.values(team_table)

  const queue = Queue.of(512)
  list.forEach((e) => {
    queue.pushTask(() =>
      ins.post('/update/teamInfo', e).then(() => {
        console.log('teamInfo', queue.total, queue.done)
      })
    )
  })
  return queue.allDone()
}

function updateEquip() {
  const uniequip_table = require('../ArknightsGameData/zh_CN/gamedata/excel/uniequip_table.json')
  const battle_equip_table = require('../ArknightsGameData/zh_CN/gamedata/excel/battle_equip_table.json')
  const list = Object.values(uniequip_table.equipDict).map((info) => {
    return {
      info,
      data: battle_equip_table[info.uniEquipId] ?? {},
    }
  })

  const queue = Queue.of(512)
  list.forEach((e) => {
    queue.pushTask(() =>
      ins.post('/update/equip', e).then(() => {
        console.log('equip', queue.total, queue.done)
      })
    )
  })
  return queue.allDone()
}

function updateChars(newList = []) {
  const character_table = require('../ArknightsGameData/zh_CN/gamedata/excel/character_table.json')
  const patchChars =
    require('../ArknightsGameData/zh_CN/gamedata/excel/char_patch_table.json').patchChars
  const voideDict =
    require('../ArknightsGameData/zh_CN/gamedata/excel/charword_table.json').voiceLangDict

  const list = [
    ...Object.entries(character_table),
    ...Object.entries(patchChars),
  ] //.filter(([key]) => key === 'char_502_nblade')

  const queue = Queue.of(12)
  // const newList = ['濯尘芙蓉']

  list
    .filter((e) => !newList.length || newList.includes(e[1].name))
    .forEach(([id, data], i) => {
      // if (i > 0) return
      const t = () =>
        ins
          .post('/update/char', { id, data, voiceLangDict: voideDict[id] })
          .then(() => {
            console.log('char', queue.total, queue.done, data.name)
          })
          .catch((err) => {
            console.log('err', id, err)
            queue.pushTask(t)
          })

      queue.pushTask(t)
    })

  return queue.allDone()
}

function getCharRaw(charId) {
  return ins.get('/update/char', { params: { id: charId } })
}

function getChar(charId) {
  return ins.post('/update/saveChar', { charId })
}

function updatePatchInfo() {
  return new Promise(async (resolve) => {
    const patchInfos =
      require('../ArknightsGameData/zh_CN/gamedata/excel/char_patch_table.json').patchDetailInfoList
    const list = Object.entries(patchInfos)

    const queue = Queue.of(512)
    list.forEach(([charId, data], i) => {
      queue.pushTask(() => ins.post('/update/patchInfo', { charId, data }))
    })

    await queue.allDone()
  })
}

function getSkill(skillId) {
  return ins.get('/s/skill', { params: { skillId } })
}

async function updateAct() {
  const acts =
    require('../ArknightsGameData/zh_CN/gamedata/excel/activity_table.json').basicInfo
  const q = Queue.of(12)
  Object.values(acts).forEach((data) => {
    q.pushTask(() => ins.post('/update/activity', data))
  })
  await q.allDone()
}

async function updateGachaPool() {
  const acts =
    require('../ArknightsGameData/zh_CN/gamedata/excel/gacha_table.json').gachaPoolClient
  const q = Queue.of(12)
  Object.values(acts)
    .filter((e) => e.gachaPoolName === '不协和音程')
    .forEach((data) => {
      q.pushTask(() =>
        ins
          .post('/update/gachaPool', data)
          .then((e) => console.log('push', data.gachaPoolName, data.gachaIndex))
      )
    })
  await q.allDone()
}
