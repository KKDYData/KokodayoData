//@ts-check

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
  if (!fs.existsSync(path.resolve(__dirname, '../ArknightsGameData/'))) {
    console.log('clone...')

    execa.commandSync(
      'git clone https://github.com/Kengxxiao/ArknightsGameData.git',
      {
        execPath: __dirname,
        stdout: 'inherit',
      }
    )
  } else {
    console.log('pull...', path.resolve(__dirname, '../ArknightsGameData/'))

    execa.commandSync('git pull', {
      execPath: path.resolve(__dirname, '../ArknightsGameData/'),
      stdout: 'inherit',
    })
  }
  console.log('Update ArknightsGameData successfully!')
}

const character_table = require('../ArknightsGameData/zh_CN/gamedata/excel/character_table.json')

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

build('Data', Object.values(token), 'Token')
build('Data', char, 'Char')
build('Data', trap, 'Trap')

const charword_table = require('../ArknightsGameData/zh_CN/gamedata/excel/charword_table.json')
build('Word', charword_table.charWords, 'CharWord')
build('Dict', Object.values(charword_table.voiceLangDict), 'CharWordDict')
// /voiceLangDict
const skill_table = require('../ArknightsGameData/zh_CN/gamedata/excel/skill_table.json')
build('Skill', skill_table, 'Skill')

const handbook_info_table = require('../ArknightsGameData/zh_CN/gamedata/excel/handbook_info_table.json')
build('Info', handbook_info_table.handbookDict, 'CharInfo')

const handbook_team_table = require('../ArknightsGameData/zh_CN/gamedata/excel/handbook_team_table.json')
build('Info', handbook_team_table, 'TeamInfo')

const char_patch_table = require('../ArknightsGameData/zh_CN/gamedata/excel/char_patch_table.json')
const { patchChars, patchDetailInfoList } = char_patch_table

build('Info', Object.values(patchDetailInfoList), 'PatchInfo')

const enemy_handbook_table = require('../ArknightsGameData/zh_CN/gamedata/excel/enemy_handbook_table.json')
const EXTRA_ENEMY_KEYS = ['enemy_3001_upeopl']
// const extraEnemy = enemy_handbook_table.enemy_3001_upeopl
const normalEnemy = Object.values(enemy_handbook_table) //omit(EXTRA_ENEMY_KEYS, enemy_handbook_table)

build('Info', normalEnemy, 'EnemyInfo')
// build('Data', extraEnemy, 'ExEnemyInfo')

const range_table = require('../ArknightsGameData/zh_CN/gamedata/excel/range_table.json')
build('Data', range_table, 'Range')

const building_table = require('../ArknightsGameData/zh_CN/gamedata/excel/building_data.json')

build('Skill', building_table.chars, 'Building')
build('Buff', building_table.buffs, 'BuildingBuff')

const stage_table = require('../ArknightsGameData/zh_CN/gamedata/excel/stage_table.json')

build('Stage', stage_table.stages, 'StageInfo')
build('Tile', stage_table.tileInfo, 'TileInfo')

const enemy_database = require('../ArknightsGameData/zh_CN/gamedata/levels/enemydata/enemy_database.json')

build('Data', enemy_database.enemies, 'EnemyData')

const stageMap = []

const readStage = (p) => {
  fs.readdirSync(path.resolve(__dirname, p), { withFileTypes: true }).forEach(
    (k) => {
      if (k.isDirectory()) {
        readStage(p + '/' + k.name)
      } else {
        stageMap.push(require(p + '/' + k.name))
      }
    }
  )
}
const LEVEL_DIR = '../ArknightsGameData/zh_CN/gamedata/levels/obt/main'
readStage(LEVEL_DIR)
readStage('../ArknightsGameData/zh_CN/gamedata/levels/activities')

build('Data', stageMap, 'StageData')

const activityTable = require('../ArknightsGameData/zh_CN/gamedata/excel/activity_table.json')
build('Info', activityTable.basicInfo, 'ActivityInfo')

const gachaTable = require('../ArknightsGameData/zh_CN/gamedata/excel/gacha_table.json')
build('Info', gachaTable.gachaPoolClient, 'GachaPoolInfo')

const ItemTable = require('../ArknightsGameData/zh_CN/gamedata/excel/item_table.json')
build('Data', ItemTable.items, 'Item')

const EquipTable = require('../ArknightsGameData/zh_CN/gamedata/excel/battle_equip_table.json')
build('Data', Object.values(EquipTable), 'BattleEquip')

const UniEquipTable = require('../ArknightsGameData/zh_CN/gamedata/excel/uniequip_table.json')
build('Info', Object.values(UniEquipTable.equipDict), 'UniEquip')

fs.writeFileSync(
  path.resolve(__dirname, '../lib/index.ts'),
  exportList.map((name) => `export * as I${name} from './${name}'`).join('\n')
)

function build(name, data, namespace) {
  exportList.push(namespace)
  return transplie(name, JSON.stringify(data), namespace + '.ts')
}
