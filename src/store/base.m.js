import { Api } from '@/Api'
import { change } from './utils'
import { Data, request } from '@kkdy/api'

if (process.env.NODE_ENV === 'development') request.defaults.baseURL = '/api'

const namespaced = true

const state = {
  info: {},
}

// fixed version, originated from https://github.com/Bill4Time/javascript-natural-sort/blob/master/naturalSort.js
const naturalSort = (a, b) => {
  const re = /([+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?|^0x[0-9a-f]+$|\d+)/gi,
    sre = /(^[ ]*|[ ]*$)/g,
    hre = /^0x[0-9a-f]+$/i,
    dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
    i = function(s) {
      return (naturalSort.insensitive && ('' + s).toLowerCase()) || '' + s
    },
    // convert all to strings strip whitespace
    x = i(a.label).replace(sre, '') || '',
    y = i(b.label).replace(sre, '') || '',
    // chunk/tokenize
    xN = x
      .replace(re, '\0$1\0')
      .replace(/\0$/, '')
      .replace(/^\0/, '')
      .split('\0'),
    yN = y
      .replace(re, '\0$1\0')
      .replace(/\0$/, '')
      .replace(/^\0/, '')
      .split('\0'),
    // numeric, hex or date detection
    xD =
      parseInt(x.match(hre), 16) ||
      (xN.length !== 1 && x.match(dre) && Date.parse(x)),
    yD =
      parseInt(y.match(hre), 16) ||
      (xD && y.match(dre) && Date.parse(y)) ||
      null
  let oFxNcL, oFyNcL
  // first try and sort Hex codes or Dates
  if (yD) {
    if (xD < yD) {
      return -1
    } else if (xD > yD) {
      return 1
    }
  }
  // natural sorting through split numeric strings and default strings
  for (
    let cLoc = 0, numS = Math.max(xN.length, yN.length);
    cLoc < numS;
    cLoc++
  ) {
    // find floats not starting with '0', string or 0 if not defined (Clint Priest)
    oFxNcL =
      (!(xN[cLoc] || '').match(/^0/) && parseFloat(xN[cLoc])) || xN[cLoc] || 0
    oFyNcL =
      (!(yN[cLoc] || '').match(/^0/) && parseFloat(yN[cLoc])) || yN[cLoc] || 0
    // handle numeric vs string comparison - number < string - (Kyle Adams)
    if (isNaN(oFxNcL) !== isNaN(oFyNcL)) {
      return isNaN(oFxNcL) ? 1 : -1
    }
    // rely on string comparison if different types - i.e. '02' < 2 != '02' < '2'
    else if (typeof oFxNcL !== typeof oFyNcL) {
      oFxNcL += ''
      oFyNcL += ''
    }
    if (oFxNcL < oFyNcL) {
      return -1
    }
    if (oFxNcL > oFyNcL) {
      return 1
    }
  }
  return 0
}

const actions = {
  async getInfo({ state, commit }) {
    const { data } = await Data.ListMap()
    state.info = await Api.getInfo()
    commit(
      'setListVer',
      new Date(state.info.agent.char.update_time).toLocaleString(),
      { root: true }
    )

    if (state.info?.level?.stage) {
      // const data = await Assets.getStageList(state.info.level.stage.key)
      if (!data.ok) return
      commit('setMapList', data.result, { root: true })
      const arr = change(data.result).sort(naturalSort)
      arr.forEach((a) => {
        a.children = a.children.sort(naturalSort)
      })
      commit('setStageTree', arr, { root: true })
    }
  },
}

export { state, actions, namespaced }
