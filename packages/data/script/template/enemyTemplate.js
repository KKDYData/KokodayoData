/**
 * @returns {import('../../lib/EnemyInfo').IInfo}
 */
const enemyInfo = () => ({
  enemyId: 'enemy_1007_slime',
  enemyIndex: 'OTHER',
  enemyTags: ['OTHER'],
  sortId: 1,
  name: '源石虫',
  enemyRace: '感染生物',
  enemyLevel: 'NORMAL',
  description: 'OTHER',
  attackType: '近战',
  endure: 'D',
  attack: 'D',
  defence: 'D',
  resistance: 'D',
  ability: null,
  isInvalidKilled: false,
  overrideKillCntInfos: {},
})
module.exports = {
  enemyInfo,
}
