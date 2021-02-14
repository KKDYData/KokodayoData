const execa = require('execa')
const fs = require('fs')
const { transplie } = require('./buidlType')
const path = require('path')
const { omit, pick } = require('ramda')

/**
 * @type {string[]}
 */
const exportList = []

console.log('Clone or update ArknightsGameData...')
if (!fs.existsSync('./ArknightsGameData')) {
  execa.commandSync(
    'git clone https://github.com/Kengxxiao/ArknightsGameData.git',
    {
      execPath: __dirname,
      stdout: 'ipc'
    }
  )
} else {
  execa.commandSync('git pull', {
    execPath: __dirname,
    stdio: 'pipe'
  })
}
console.log('Update ArknightsGameData successfully!')

const character_table = require('./ArknightsGameData/zh_CN/gamedata/excel/character_table.json')

const token = {}
const char = {}
const trap = {}
const noDisplayNumber = {}
Object.entries(character_table).forEach(([id, cur]) => {
  if (cur.profession === 'TOKEN') {
    token[id] = cur
  } else if (cur.profession === 'TRAP') {
    trap[id] = cur
  } else {
    if (!cur.displayNumber) {
      noDisplayNumber[id] = cur
    } else {
      char[id] = cur
    }
  }
})

const charword_table = require('./ArknightsGameData/zh_CN/gamedata/excel/charword_table.json')
const skill_table = require('./ArknightsGameData/zh_CN/gamedata/excel/skill_table.json')
const handbook_info_table = require('./ArknightsGameData/zh_CN/gamedata/excel/handbook_info_table.json')
const handbook_team_table = require('./ArknightsGameData/zh_CN/gamedata/excel/handbook_team_table.json')
const enemy_handbook_table = require('./ArknightsGameData/zh_CN/gamedata/excel/enemy_handbook_table.json')
const range_table = require('./ArknightsGameData/zh_CN/gamedata/excel/range_table.json')

const EXTRA_ENEMY_KEYS = ['enemy_3001_upeopl']
const extraEnemy = enemy_handbook_table.enemy_3001_upeopl
const normalEnemy = omit(EXTRA_ENEMY_KEYS, enemy_handbook_table)

// quicktype 对 夜莺的鸟 处理有问题
token.token_10003_cgbird_bird.talents = null

build('Data', token, 'Token')
build('Data', char, 'Char')
build('Data', trap, 'Trap')
build('Word', charword_table, 'CharWord')
build('Skill', skill_table, 'Skill')
build('Info', handbook_info_table, 'CharInfo')
build('Info', handbook_team_table, 'TeamInfo')
build('Data', normalEnemy, 'Enemy')
build('Data', extraEnemy, 'ExEnemy')
build('Data', range_table, 'Range')

fs.writeFileSync(
  './src/index.ts',
  exportList.map(name => `export * as ${name} from './${name}'`).join('\n')
)

function build(name, data, namespace) {
  exportList.push(namespace)
  return transplie(name, JSON.stringify(data), namespace + '.ts')
}
