import { convert } from './RichText'

const changeDesc = (desc: string) => {
  const nodeTree = convert(desc)

  return nodeTree.toHtml()
}

export const changeAttackSpeed = (skill: {
  description: any
  prefabId?: string
}) => {
  const str = changeDesc(skill.description)

  let res = str.replace(
    /(\{)(.*?)(\})/g,
    (match: any, p1: any, p2: string, p3: any, p4: any, p5: any) => {
      let percent = '',
        scale = 1
      let minus = false
      let res = ''

      if (p2.match(/:0%/)) {
        p2 = p2.slice(0, -3)
        percent = '%'
      }
      if (p2.match(/:0\.0%/)) {
        p2 = p2.slice(0, -5)
        percent = '%'
        scale = 2
      }
      if (p2.match(/:0\.0/)) {
        p2 = p2.slice(0, -4)
        percent = ''
      } else if (p2.match(/:0/)) {
        p2 = p2.slice(0, -2)
        percent = ''
      }
      if (p2.match(/-/)) {
        p2 = p2.slice(1)
        minus = true
      }
      let temp = findValue(skill, 'blackboard', p2.toLowerCase())
      if (temp) {
        res = temp.value
        if (minus) res *= -1
        if (percent)
          res = Math.round(res * 10 ** (scale + 1)) / 10 ** (scale - 1)
      }
      return res + percent
    }
  )

  const skill_base_time = findValue(skill, 'blackboard', 'base_attack_time')

  //! 人太菜，维护不了这个东西
  const AtkBasetimeIndex = -1 // decNoValue(res, skill_base_time, '攻击间隔')
  if (AtkBasetimeIndex > -1) {
    const text = getValueDesc(res, AtkBasetimeIndex, 4)
    let value = skill_base_time.value
    let unit = 's'

    //@ts-ignore
    if (exSkill1.has(skill.prefabId)) {
      value = value * 10 * 10
      unit = '%'
    }
    // 只有白雪 !text
    if (text) {
      const inject = `(${value}${unit})`
      const testText = text[0].replace(text[2], text[2] + inject)

      const insertIndex = res.match(text[0]).index
      const before = res.slice(0, insertIndex)
      const after = res.slice(insertIndex + text[0].length)
      res = before + testText + after
    } else {
      const inject = wrapColor(`(${value}${unit})`, '#F49800')
      res = res.replace('增大', '增大' + inject)
    }
  }

  // 其实只有白金需要
  const attack_speed = findValue(skill, 'blackboard', 'attack_speed')
  const atkSpeedIndex = decNoValue(res, attack_speed, '攻击速度(?!<|\\+|-)')
  const text = getValueDesc(res, atkSpeedIndex, 4)
  if (atkSpeedIndex > -1 && text) {
    const value = attack_speed.value
    const inject = text ? `(${value})` : wrapColor(`(${value})`, '#F49800') //`<i style="color:#F49800;font-style: normal;">(${value})</i>`
    const tempIndex = (text ? text[0].length : 4) + (res.match(/略微/) ? 2 : 0)

    const temp = res.split('')
    temp.splice(atkSpeedIndex + tempIndex, 0, inject)
    res = temp.join('')
  }

  // 只有白面
  const spUp = res.match(/技力回复速度/)
  if (spUp) {
    const temp = res.split('')
    const value = findValue(skill, 'blackboard', 'sp_recovery_per_sec').value
    temp.splice(spUp.index + 6, 0, wrapColor(`(${value * 100}%)`, '#F49800')) //`<i style="color:#F49800;font-style: normal;">(${value * 100}%)</i>`)
    res = temp.join('')
  }

  // 阿
  if (res.match(/生命(.{1,9})减少/)) {
    const hp_ratio = findValue(skill, 'blackboard', 'hp_ratio')
    res += wrapColor(`(每秒减少${hp_ratio?.value * 100}%)`, '#F49800')
  }

  //@ts-ignore
  if (exSkill2.has(skill.prefabId)) {
    //@ts-ignore
    res += `<br /> ${wrapColor(exSkill2.get(skill.prefabId), '#f14040')}`
  }

  return res
}

const findValue = (data: { [x: string]: any }, attr: string, key: string) => {
  if (data && data[attr]) {
    return data[attr].find((el: { key: any }) => el.key === key)
  } else {
    console.error(`There is no Attr ${attr} in `, data)
    return 0
  }
}

const wrapColor = (str: string | undefined, color: string) =>
  `<i style="color:${color};font-style: normal;">${str}</i>`

const exSkill1 = new Set([
  'skchr_skfire_2',
  'skchr_aglina_2',
  'skchr_liskam_2',
  'skchr_cerber_2',
  'skchr_finlpp_2',
  'skchr_weedy_2',
  'skchr_broca_2',
  'skchr_brownb_2',
  'skchr_rosmon_3',
  'skchr_pasngr_2',
])

const exSkill2 = new Map([
  ['skchr_angel_3', '据实测攻击间隔缩短效果翻倍'],
  [
    'skchr_rosmon_3',
    '听说攻击间隔是减一半，如果不对，走反馈或者进群找我改一下',
  ],
])

const getValueDesc = (res: string, index: number, offset: number) =>
  res.slice(index + offset).match(/(<.*?>)(.*?)(<\/.*?>)/)
const decNoValue = (
  res: string,
  data: { value: number },
  str: string | RegExp
) => {
  if (!data || !data.value) return -1
  const temp = res.match(new RegExp(str))
  if (temp && !new RegExp(`/${str}(.{2,}${Math.abs(data.value)})/`).test(res))
    return temp.index!
  else return -1
}
