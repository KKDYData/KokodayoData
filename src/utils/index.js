import store from '../store'
import { getStageType, statusToChChar } from './string'
import { path } from './listVer'
import { getHeroData, getSkill } from './fetch'
import UaParser from 'ua-parser-js'


const debounce = (action, idle, ...args) => {
  let last
  return (e) => {
    clearTimeout(last)
    last = setTimeout(action, idle, ...args)
  }
}


const throttle = (action, delay, ...args) => {
  let last = 0
  return (...event) => {
    let curr = +new Date()
    if (curr - last > delay) {
      action(...args, ...event)
      last = curr
    }
  }
}


function sort(array, less) {
  function swap(i, j) {
    const t = array[i]
    array[i] = array[j]
    array[j] = t
  }
  function quicksort(left, right) {
    if (left < right) {
      const pivot = array[left + Math.floor((right - left) / 2)]
      let
        left_new = left,
        right_new = right

      do {
        while (less(array[left_new], pivot)) {
          left_new += 1
        }
        while (less(pivot, array[right_new])) {
          right_new -= 1
        }
        if (left_new <= right_new) {
          swap(left_new, right_new)
          left_new += 1
          right_new -= 1
        }
      } while (left_new <= right_new)

      quicksort(left, right_new)
      quicksort(left_new, right)
    }
  }
  quicksort(0, array.length - 1)
  return array
}

class TaskQueue {
  constructor(concurrency, finalTask = () => { }, queue = []) {
    this.concurrency = concurrency
    this.running = 0
    this.queue = queue
    this.finalTask = finalTask

    return this
  }

  pushTask(task) {
    this.queue.push(task)
    this.next()
  }

  next() {
    while (this.running < this.concurrency && this.queue.length) {
      const task = this.queue.shift()
      task().then(() => {
        this.running--
        this.next()
      })
      this.running++
    }
    if (this.running === 0 && this.queue.length === 0) {
      console.log('Task is over')
      this.finalTask()
    }
  }
}


const changeDesc = (desc) => {
  const reg1 = /(<\/>)/g,
    reg2 = /\\n/g


  const d = {
    ccVup: 'cc\\.vup',
    ccVdown: 'cc\\.vdown|talpu|pn',
    baPn: 'ba\\.pn',
    baDown: 'ba\\.vdown',
    ccRem: 'cc\\.rem',
    ccKw: 'cc\\.kw',
    baVup: 'ba\\.vup',
    baRem: 'ba\\.rem',
    baKw: 'ba\\.kw',
    baTalpu: 'ba\\.talpu',
    lvItem: 'lv\\.itme|rem|fs',
    timeLimit: 'act\\.timeLimit'
  }

  const colorTemp = [
    ['FF6237', ['baDown', 'ccVdown', 'baPn']],
    ['0098DC', ['ccVup', 'baVup']],
    ['F49800', ['ccRem', 'baRem', 'baTalpu']],
    ['00B0FF', ['ccKw', 'baKw']],
    ['049cb8', ['lvItem']],
    ['ff5500', ['timeLimit']]
  ]

  const findColor = (k) => {
    const [color] = colorTemp.find(([color, list]) => !!list.find(e => {
      const reg = new RegExp(d[e] || '')
      return reg.test(k)
    }
    )) || ['FF6237']
    return '#' + color
  }
  if (!reg1.test(desc) && !reg2.test(desc)) return desc

  if (/下一次的攻击力/.test(desc)) {
    console.log('hit')
  }
  let matchType = '', matchValueBegin, matchValue = '', matchTagBegin, matchTagStartBegin, matchTagEndBegin
  const matchTypeGroup = []
  const matchValueGroup = []

  desc = desc.split('').reduce((res, cur) => {

    // tag 标签开始
    if (cur === '<') {
      if (matchValue) {
        matchValueGroup.push(matchValue + '')
        matchValue = ''
      }

      matchTagBegin = true
      return res
    }

    if (matchTagBegin) {

      matchValueBegin = false
      if (cur === '@') {
        matchTagStartBegin = true
      } else if (cur === '/') {
        matchTagEndBegin = true
      } else {
        matchValueBegin = true
        matchValue += '<' + cur
      }

      matchTagBegin = false
      return res
    }



    // 标签结束
    if (cur === '>') {
      if (matchTagStartBegin) {
        matchTagStartBegin = false
        matchTypeGroup.push(matchType)
        matchType = ''
      } else if (matchTagEndBegin) {
        matchTagEndBegin = false

        let temp = `<i style="color:${findColor(matchTypeGroup.pop()) || '#0098DC'};font-style: normal;">${matchValueGroup.pop()}</i>`
        if (matchValueGroup.length) {
          matchValue = matchValueGroup.pop() + temp
        } else {
          res += temp
          matchValue = ''
        }
      } else {
        matchValue += '>'
      }

      if (matchTypeGroup.length) {
        matchValueBegin = true
      } else {
        matchValueBegin = false
      }
      return res
    }

    // 标签头内容
    if (matchTagStartBegin) {
      matchType += cur
      return res
    }
    // 标签尾内容
    if (matchTagEndBegin) {
      // 正常应该是进不来的
      return res
    }

    // 标签内的内容
    if (matchValueBegin) {
      matchValue += cur
      return res
    }

    // 标签外的内容
    res += cur
    return res
  }, '')

  desc = desc.replace(reg2, '<br />')

  return desc
}


const getClass_icon = (c) => {
  return path + 'others/icon_profession_' + c.toLowerCase() + '.png'
}



const getUA = () => {
  const ua = new UaParser()
  const OS = ua.getOS()
  const Browser = ua.getBrowser()
  const width = document.body.clientWidth
  const isMoblie = ua.getDevice().type === 'mobile'
  const isMobliePad = isMoblie || OS.name === 'iOS' || (OS.name === 'Mac OS' && width < 1300)

  return {
    isMoblie,
    Browser,
    ok: !(OS.name == 'iOS' ||
      (OS.name === 'Mac OS' && Browser.name === 'Safari') ||
      (Browser.name === 'Edge' && Browser.version < '18')),
    isMobliePad
  }
}

const UA = getUA()

window.addEventListener('resize', throttle(() => {
  const w = document.body.clientWidth
  store.commit('setShort', w < 600 ? true : false)
  store.commit('setScreenWidth', w)
}, 500))


const getProfilePath = (name, row) => {
  if (row) return getDetailsProfilePath(name)
  return UA.ok ? `${path}char/portrait/${name}.png?x-oss-process=style/webp`
    : `${path}char/portrait/${name}.png`
}

const getDetailsProfilePath = name => {
  return `${path}char/profile/${name}.png`
}

const changeKey = key => {
  const test = /_/.exec(key)
  if (test) {
    const temp = key.split('')
    temp.splice(test.index, 1)
    temp[test.index] = temp[test.index].toUpperCase()
    return temp.join('')
  } else {
    return key
  }
}

const findValue = (data, attr, key) => {
  if (data && data[attr]) {
    return data[attr].find(el => el.key === key)
  } else {
    console.error(`There is no Attr ${attr} in `, data)
    return 0
  }
}

const getValueDesc = (res, index, offset) => res.slice(index + offset).match(/(<.*?>)(.*?)(<\/.*?>)/)
const decNoValue = (res, data, str) => {
  if (!data || !data.value) return -1
  const temp = res.match(new RegExp(str))
  if (temp && !new RegExp(`/${str}(.{2,}${Math.abs(data.value)})/`).test(res)) return temp.index
  else return -1
}

const wrapColor = (str, color) => `<i style="color:${color};font-style: normal;">${str}</i>`

const exSkill1 = new Set(['skchr_skfire_2', 'skchr_aglina_2', 'skchr_liskam_2', 'skchr_cerber_2', 'skchr_finlpp_2'])
const exSkill2 = new Map([['skchr_angel_3', '据实测攻击间隔缩短效果翻倍']])

const changeAttackSpeed = (skill) => {
  const str = changeDesc(skill.description)
  let res = str.replace(/(\{)(.*?)(\})/g, (match, p1, p2, p3, p4, p5) => {
    let percent = '', scale = 1
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
      if (percent) res = Math.round(res * 10 ** (scale + 1)) / 10 ** (scale - 1)
    }
    return res + percent
  })

  const skill_base_time = findValue(skill, 'blackboard', 'base_attack_time')
  const AtkBasetimeIndex = decNoValue(res, skill_base_time, '攻击间隔')
  if (AtkBasetimeIndex > -1) {
    const text = getValueDesc(res, AtkBasetimeIndex, 4)
    let value = skill_base_time.value
    let unit = 's'
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
    const inject = text ? `(${value})` : wrapColor(`(${value})`, '#F49800')//`<i style="color:#F49800;font-style: normal;">(${value})</i>`
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
    temp.splice(spUp.index + 6, 0, wrapColor(`(${value * 100}%)`, '#F49800'))//`<i style="color:#F49800;font-style: normal;">(${value * 100}%)</i>`)
    res = temp.join('')
  }

  // 阿
  if (res.match(/生命.+减少/)) {
    const hp_ratio = findValue(skill, 'blackboard', 'hp_ratio')
    res += wrapColor(`(每秒减少${hp_ratio.value * 100}%)`, '#F49800')
  }

  if (exSkill2.has(skill.prefabId)) {
    res += `<br /> ${wrapColor(exSkill2.get(skill.prefabId), '#f14040')}`
  }

  return res
}

const calStatus = (lv, data) => {
  return data.reduce((zero, max) => {
    const diff = max.level - zero.level
    const res = Object.entries(max.data).reduce((res, cur) => {
      const [k, v] = cur
      res[k] = Math.round((v - zero.data[k]) / diff * (lv - 1)) + zero.data[k]
      return res
    }, {})
    return res
  })
}

const calStatusEnd = (baseData, level, targetPhasese, isFavor, potentailStatusUP) => {
  const data = calStatus(level, targetPhasese)
  return Object.entries(data).reduce((res, cur) => {
    // 判定是否显示属性，没有就是我看不懂，或者觉得没意义的
    const [key, value] = cur
    if (!statusToChChar(key)) return res
    let nV = value, addV = 0
    // 判定是是否满好感
    if (isFavor && baseData.favorKeyFrames) {
      const v = baseData.favorKeyFrames[1].data[key]
      if (v !== 0) {
        addV += v
        nV += v
      }
    }
    // 判定潜能提升
    potentailStatusUP.forEach(el => {
      el.forEach(el => {
        if (el.type === key) {
          if (key === 'baseAttackTime') {
            addV += el.value
            nV = Math.floor((nV / (el.value / 100 + 1)) * 100) / 100
          } else {
            addV += el.value
            nV += el.value
          }
        }
      })
    })
    const upOrMinus = addV > 0 ? '+' : ''
    if (addV) nV = nV + '<i style="color: #F49800;font-style: normal;">(' + upOrMinus + addV + ')</i>'
    res[key] = nV
    return res
  }, {})
}

const preDefineCompute = (asyncData, baseData) => {
  const res = baseData.map(el => {
    const key = el.inst.characterKey
    const target = asyncData.find(item => key === item.key)

    if (!target) return
    const { data, targetSkill } = target
    const targetData = calStatus(el.inst.level, data.phases[el.inst.phase].attributesKeyFrames)
    return { key, targetData, targetSkill, ...data, ...el }
  })
  return res.filter(el => el)
}

const preDefineGet = async (key, baseData) => {
  const temp = baseData[key].reduce((res, cur) => res.add(cur.inst.characterKey), new Set())
  if (temp.length === 0) return []
  const res = await Promise.all([...temp].map(key => getHeroData(key).then(data => ({ key, data }))))
  for (const char of res) {
    const base = baseData[key].find(el => el.inst.characterKey === char.key)
    const targetSkill = char.data.skills[base.skillIndex]
    if (targetSkill) {
      const skillKey = targetSkill.skillId
      char.targetSkill = [await getSkill(skillKey)]
    }
  }
  return preDefineCompute(res, baseData[key])
}

const bsr = (t, a1, a2, a3, a4) => a1 * (1 - t) * (1 - t) * (1 - t) + 3 * a2 * t * (1 - t) * (1 - t) + 3 * a3 * t * t * (1 - t) + a4 * t * t * t

const findStage = (map, tree) => {
  const splitTemp = map.split('_')
  let groupName = splitTemp[0]
  if (groupName === 'sub') groupName = 'main'
  const type = getStageType(groupName)
  const group = tree.find(el => el.label === type)
  let target
  if (!group) return ''
  if (group.label === '主线') {
    const chapter = splitTemp[1].split('-')
    if (splitTemp[0] === 'main') {
      target = group.children[+chapter[0]].children.find(el => el.path === map)
    } else {
      //支线
      const temp = group.children[+chapter[0]]
      target = temp.children[temp.children.length - 1].children.find(el => el.path === map)
    }
  } else {
    map = map.replace('wk', 'weekly').replace('pro', 'promote')
    target = group.children.find(el => el.path === map)
  }
  return target
}

const getSkinsData = {
  skins({ displaySkin, avatarId }) {
    return {
      charSet: this.getSkinSet(avatarId),
      profile: this.getSkinProile(avatarId),
      halfPic: this.getSkinhalfPic(avatarId),
      avatarId: encodeURIComponent(avatarId),
      displaySkin
    }
  },
  getSkinProile(id) {
    return path + 'char/profile/' + encodeURIComponent(id) + this.style
  },
  getSkinhalfPic(id) {
    return path + 'char/halfPic/' + encodeURIComponent(id) + this.style
  },
  getSkinSet(id) {
    return path + 'char/set/' + encodeURIComponent(id) + '.png'
  },
  style: !UA.ok
    ? '.png'
    : '.png?x-oss-process=style/small-test'
}

const getScreenWidth = () => {
  const short = store.state.short
  const w = document.body.clientWidth - (short ? 40 : 60)
  const h = window.innerHeight
  const radio = 1.5

  if (w > h) {
    if (h * radio > w) {
      return {
        width: w,
        height: w / radio
      }
    }
    return {
      width: h * radio,
      height: h
    }
  } else {
    return {
      width: w,
      height: short ? h * 0.95 : w * 0.8
    }
  }
}

const getfontSize = (str, mSize = 34, nSize = 16, baseLen = 4) => {
  const short = store.state.short
  const base = short ? mSize : nSize
  const temp = Math.min(baseLen / str.length * base, base)
  return short ? (temp / 750 * 100) + 'vw' : temp + 'px'
}


const sleep = time => {
  return new Promise(resolve => {
    setTimeout(() => resolve(), time)
  })
}

const loadImg = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = err => console.log(err)
    img.onerror = reject
    img.src = url
  })


export {
  TaskQueue,
  findValue,
  sleep,
  loadImg,

  // 业务相关类
  debounce,
  throttle,
  bsr,//三阶贝塞尔
  sort,
  changeDesc,
  findStage,
  changeAttackSpeed,
  calStatus,
  calStatusEnd,
  preDefineCompute,
  preDefineGet,
  changeKey,
  getSkinsData,

  // 转换路径类，可能需要转义到string
  getProfilePath,
  getDetailsProfilePath,
  getClass_icon,

  // 设备检测
  UA,
  getScreenWidth,
  getfontSize
}
