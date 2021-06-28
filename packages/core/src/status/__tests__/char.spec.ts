import { IChar } from '@kkdy/data'
import { calcStatusWithKeyFrame, hello, mergeStatus } from '../char'
import CharData from './CharData.json'

const char = CharData.char_242_otter as IChar.IData

describe('hello', () => {
  it('world', () => {
    expect(hello()).toBe('world')
  })
})

describe('calc char status', () => {
  it('calc level 1', () => {
    expect(
      calcStatusWithKeyFrame(char.phases[0].attributesKeyFrames, 1)
    ).toStrictEqual({
      maxHp: 480,
      atk: 199,
      def: 56,
      magicResistance: 15,
      cost: 9,
      blockCnt: 1,
      attackSpeed: 100,
      baseAttackTime: 2,
      respawnTime: 70,
    })
  })

  it('calc level 50', () => {
    expect(
      calcStatusWithKeyFrame(char.phases[0].attributesKeyFrames, 50)
    ).toStrictEqual({
      maxHp: 649,
      atk: 285,
      def: 80,
      magicResistance: 15,
      cost: 9,
      blockCnt: 1,
      attackSpeed: 100,
      baseAttackTime: 2,
      respawnTime: 70,
    })
  })

  it('calc level 18', () => {
    expect(
      calcStatusWithKeyFrame(char.phases[0].attributesKeyFrames, 18)
    ).toStrictEqual({
      maxHp: 539,
      atk: 229,
      def: 64,
      magicResistance: 15,
      cost: 9,
      blockCnt: 1,
      attackSpeed: 100,
      baseAttackTime: 2,
      respawnTime: 70,
    })
  })

  it('calc level 50 with favor lv50', () => {
    const sts = calcStatusWithKeyFrame(char.phases[0].attributesKeyFrames, 50)
    const favorStatus = calcStatusWithKeyFrame(char.favorKeyFrames, 50, true)
    expect(mergeStatus(sts, favorStatus)).toStrictEqual({
      maxHp: 849,
      atk: 320,
      def: 80,
      magicResistance: 15,
      cost: 9,
      blockCnt: 1,
      attackSpeed: 100,
      baseAttackTime: 2,
      respawnTime: 70,
    })
  })
})
