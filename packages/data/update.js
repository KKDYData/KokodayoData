const { default: Axios } = require('axios')
const { Queue } = require('@kkdy/queue')

const ins = Axios.create({
  baseURL: 'http://127.0.0.1:7001',
})

;(async () => {
  // const { data } = await ins.get('/')
  // await updateBuildingBuff()
  // await updateBuildingSkill()
  // await updateCharInfo()
  // await updateCharword()
  // await updateSkill()
  // await updatePatchInfo()
  // await updateTeamInfo()
  // await updateChars()
  // const { data }
  // return
  const { data } = await ins.get('/data/list')
  // const { data } = await getChar('char_010_chen')
  // const { data: skills } = await getSkill('skcom_atk_up[1]')
  console.log('data', data)
  // console.log('skill', skills)
})()

async function updateBuildingBuff() {
  const hook_book = require('./ArknightsGameData/zh_CN/gamedata/excel/building_data.json')
    .buffs

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
  const hook_book = require('./ArknightsGameData/zh_CN/gamedata/excel/building_data.json')
    .chars

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
  return new Promise((resolve) => {
    const hook_book = require('./ArknightsGameData/zh_CN/gamedata/excel/handbook_info_table.json')
      .handbookDict

    const list = Object.values(hook_book)

    const queue = Queue.of(144, resolve)
    list.forEach((e) => {
      queue.pushTask(() =>
        ins.post('/update/charInfo', e).then(() => {
          console.log('charInfo', queue.total, queue.done)
        })
      )
    })
  })
}

function updateSkill() {
  return new Promise((resolve) => {
    const skill_table = require('./ArknightsGameData/zh_CN/gamedata/excel/skill_table.json')
    const list = Object.values(skill_table)

    const queue = Queue.of(144, { finalTask: resolve })
    list.forEach((e) => {
      queue.pushTask(() =>
        ins.post('/update/skill', e).then(() => {
          console.log('skill', queue.total, queue.done)
        })
      )
    })
  })
}

function updateCharword() {
  return new Promise((resolve) => {
    const charword_table = require('./ArknightsGameData/zh_CN/gamedata/excel/charword_table.json')
    const list = Object.values(charword_table)

    const queue = Queue.of(512, { finalTask: resolve })
    list.forEach((e) => {
      queue.pushTask(() =>
        ins.post('/update/charword', e).then(() => {
          console.log('word', queue.total, queue.done)
        })
      )
    })
  })
}

function updateTeamInfo() {
  return new Promise((resolve) => {
    const team_table = require('./ArknightsGameData/zh_CN/gamedata/excel/handbook_team_table.json')
    const list = Object.values(team_table)

    const queue = Queue.of(512, { finalTask: resolve })
    list.forEach((e) => {
      queue.pushTask(() =>
        ins.post('/update/teamInfo', e).then(() => {
          console.log('teamInfo', queue.total, queue.done)
        })
      )
    })
  })
}

function updateChars() {
  return new Promise((resolve) => {
    const character_table = require('./ArknightsGameData/zh_CN/gamedata/excel/character_table.json')
    const patchChars = require('./ArknightsGameData/zh_CN/gamedata/excel/char_patch_table.json')
      .patchChars
    const list = [
      ...Object.entries(character_table),
      ...Object.entries(patchChars),
    ]

    const queue = Queue.of(512, { finalTask: resolve })
    list.forEach(([id, data], i) => {
      // if (i > 0) return
      queue.pushTask(() =>
        ins.post('/update/char', { id, data }).then(() => {
          console.log('char', queue.total, queue.done)
        })
      )
    })
  })
}

function getCharRaw(charId) {
  return ins.get('/update/char', { params: { id: charId } })
}

function getChar(charId) {
  return ins.post('/update/saveChar', { charId })
}

function updatePatchInfo() {
  return new Promise((resolve) => {
    const patchInfos = require('./ArknightsGameData/zh_CN/gamedata/excel/char_patch_table.json')
      .patchDetailInfoList
    const list = Object.entries(patchInfos)

    const queue = Queue.of(512, { finalTask: resolve })
    list.forEach(([charId, data], i) => {
      queue.pushTask(() => ins.post('/update/patchInfo', { charId, data }))
    })
  })
}

function getSkill(skillId) {
  return ins.get('/s/skill', { params: { skillId } })
}
