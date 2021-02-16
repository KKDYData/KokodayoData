const execa = require('execa')
const fs = require('fs')
const { transplie } = require('./buidlType')
const path = require('path')
const { omit, pick } = require('ramda')
const args = require('minimist')(process.argv.slice(2))

const { 'skip-pull': skipPull } = args

/**
 * @type {string[]}
 */
const exportList = []

if (skipPull) {
  console.log('Skip update ArknightsGameData')
} else {
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
}

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

// quicktype 对 夜莺的鸟 处理有问题
token.token_10003_cgbird_bird.talents = null

build('Data', token, 'Token')
build('Data', char, 'Char')
build('Data', trap, 'Trap')

const charword_table = require('./ArknightsGameData/zh_CN/gamedata/excel/charword_table.json')
build('Word', charword_table, 'CharWord')

const skill_table = require('./ArknightsGameData/zh_CN/gamedata/excel/skill_table.json')
build('Skill', skill_table, 'Skill')

const handbook_info_table = require('./ArknightsGameData/zh_CN/gamedata/excel/handbook_info_table.json')
build('Info', handbook_info_table, 'CharInfo')

const handbook_team_table = require('./ArknightsGameData/zh_CN/gamedata/excel/handbook_team_table.json')
build('Info', handbook_team_table, 'TeamInfo')

const enemy_handbook_table = require('./ArknightsGameData/zh_CN/gamedata/excel/enemy_handbook_table.json')
const EXTRA_ENEMY_KEYS = ['enemy_3001_upeopl']
const extraEnemy = enemy_handbook_table.enemy_3001_upeopl
const normalEnemy = omit(EXTRA_ENEMY_KEYS, enemy_handbook_table)

build('Data', normalEnemy, 'EnemyInfo')
build('Data', extraEnemy, 'ExEnemyInfo')

const range_table = require('./ArknightsGameData/zh_CN/gamedata/excel/range_table.json')
build('Data', range_table, 'Range')

const building_table = require('./ArknightsGameData/zh_CN/gamedata/excel/building_data.json')

build('Skill', building_table.chars, 'Building')
build('Buff', building_table.buffs, 'BuildingBuff')

const stage_table = require('./ArknightsGameData/zh_CN/gamedata/excel/stage_table.json')

build('Stage', stage_table.stages, 'StageInfo')
build('Tile', stage_table.tileInfo, 'TileInfo')

const enemy_database = require('./ArknightsGameData/zh_CN/gamedata/levels/enemydata/enemy_database.json')

build('Data', enemy_database.enemies, 'EnemyData')

const stageMap = {}
const l = [1]

const readStage = p => {
  fs.readdirSync(p, { withFileTypes: true }).forEach(k => {
    if (k.isDirectory()) {
      readStage(p + '/' + k.name)
    } else {
      stageMap[k.name] = require(p + '/' + k.name)
    }
  })
}
const LEVEL_DIR = './ArknightsGameData/zh_CN/gamedata/levels/obt/main'
readStage(LEVEL_DIR)
readStage('./ArknightsGameData/zh_CN/gamedata/levels/activities')

build('Data', stageMap, 'StageData')

fs.writeFileSync(
  './src/index.ts',
  exportList.map(name => `export * as ${name} from './${name}'`).join('\n')
)

function build(name, data, namespace) {
  exportList.push(namespace)
  return transplie(name, JSON.stringify(data), namespace + '.ts')
}
