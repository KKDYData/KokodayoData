import store from '../store';
import { StageType } from './string';

const setVer = (name, ver) => {
  store.commit(name, new Date(ver).toLocaleString());
};


const debounce = function (action, idle) {
  let last;
  return function () {
    const ctx = this,
      args = arguments;
    clearTimeout(last);
    last = setTimeout(() => {
      action.apply(ctx, args);
    }, idle);
  };
};



const throttle = function (action, delay) {
  var last = 0;
  return function () {
    var curr = +new Date();
    if (curr - last > delay) {
      // console.log('hit  ' + (curr - last));
      action.apply(this, arguments);
      last = curr;
    }
  };
};

const path = process.env.NODE_ENV === 'development' ? 'https://arknights-data.oss-cn-beijing.aliyuncs.com/dataX/'
  : 'https://andata.somedata.top/dataX/';

const fetchPut = (url, data) => {
  return fetch(url, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  }).then(res => res.json())
    .catch(err => Promise.reject(err));

};



const submitFeedback = content => {
  return fetchPut('/api/arknights/feedback', content)
    .catch(err => console.error(err))
    .then(res => Promise.resolve(res));
};

//包装fetch，使用get
const fetchGet = (url) => {
  return fetch(url, {
    method: 'GET',
    mode: 'cors'
  }).then(res => {
    if (res.ok) {
      return res.json();
    }
    else {
      return Promise.reject('server error');
    }
  });
};



const getProfileList = () => {
  return fetchGet('/api/arknights/data/shortList')
    .then(res => fetchGet(path + res.name.slice(6)))
    .catch(err => {
      console.log(err);
      return [];
    });
};

const getEnemyList = () => {
  return fetchGet('/api/arknights/data/enemyList')
    .then(res => {
      setVer('setEnemyVer', res.lastModified);
      return fetchGet(path + res.name.slice(6));//改成拼链接
    }
    )
    .catch(err => {
      console.log(err);
      return [];
    });
};


const getEneAppearMap = () => {
  return fetchGet('/api/arknights/data/enemyAppearMap')
    .then(res => {
      setVer('setApperMapVer', res.lastModified);
      return fetchGet(path + res.name.slice(6));//改成拼链接
    })
    .catch(err => {
      console.error('error', err);
      return [];
    });
};

const getDevList = () => {
  return fetchGet('/api/arknights/data/devList')
    .then(res => {
      setVer('setListVer', res.lastModified);
      return fetchGet(path + res.name.slice(6));//改成拼链接
    })
    .catch(err => {
      console.error('error', err);
      return [];
    });
};

const getStageList = () => {
  return fetchGet('/api/arknights/data/stageList')
    .then(res => {
      // setVer('setListVer', res.lastModified);
      return fetchGet(path + res.name.slice(6));//改成拼链接
    })
    .catch(err => {
      console.error('error', err);
      return [];
    });
};


const getHeroData = name => {
  return fetchGet(path + 'char/data/' + name + '.json')
    .catch(err => console.error(err));
};

const getEnemyData = key => {
  return fetchGet(path + 'enemy/data/details/' + key + '.json')
    .catch(err => console.error(err));
};

const getMapData = name => {
  return fetchGet(path + 'map/data/' + name + '.json')
    .catch(err => console.error(err));
};

const getMapDataListVer = name => {
  return fetchGet(path + 'map/exData/' + name + '.json')
    .catch(err => console.error(err));
};




function sort(array, less) {

  function swap(i, j) {
    const t = array[i];
    array[i] = array[j];
    array[j] = t;
  }

  function quicksort(left, right) {

    if (left < right) {
      const pivot = array[left + Math.floor((right - left) / 2)];
      let
        left_new = left,
        right_new = right;

      do {
        while (less(array[left_new], pivot)) {
          left_new += 1;
        }
        while (less(pivot, array[right_new])) {
          right_new -= 1;
        }
        if (left_new <= right_new) {
          swap(left_new, right_new);
          left_new += 1;
          right_new -= 1;
        }
      } while (left_new <= right_new);

      quicksort(left, right_new);
      quicksort(left_new, right);

    }
  }

  quicksort(0, array.length - 1);

  return array;
}


const sortByTime = data => {
  const format = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  });
  data.forEach(element => {
    const date = element.time ? new Date(element.time) : '';
    if (date) element.time = format.format(date);
    element.editing = false;
  });
  try {
    return sort(data, (a, b) => {
      return a.time > b.time;
    });
  } catch (error) {
    console.log(error);
  }
};

const class_chinese = {
  MEDIC: { isTag: false, text: '医疗', value: 'MEDIC', short: '医' },
  CASTER: { isTag: false, text: '术士', value: 'CASTER', short: '术' },
  SNIPER: { isTag: false, text: '狙击', value: 'SNIPER', short: '狙' },
  WARRIOR: { isTag: false, text: '近卫', value: 'WARRIOR', short: '战' },
  PIONEER: { isTag: false, text: '先锋', value: 'PIONEER', short: '先' },
  TANK: { isTag: false, text: '重装', value: 'TANK', short: '重' },
  SPECIAL: { isTag: false, text: '特种', value: 'SPECIAL', short: '特' },
  SUPPORT: { isTag: false, text: '辅助', value: 'SUPPORT', short: '辅' },

};

const getClass_Chinese = en => {
  return class_chinese[en].text;
};

const getClass_Short = en => {
  return class_chinese[en].short;
};





const changeDesc = (desc) => {
  const reg1 = /(<\/>)/g,
    reg2 = /\\n/g,
    ccVup = /(<@cc\.vup>)/g,
    ccVdown = /(<@cc\.(vdown|talpu|pn)>)/g,
    // ccPn = /(<@cc.pn>)/g,
    // ccTalpu = /(<@cc.talpu>)/g,
    baPn = /(<@ba\.pn>)/g,
    baVdown = /(<@ba\.vdown>)/g,
    ccRem = /(<@cc\.rem>)/g,
    ccKw = /(<@cc\.kw>)/g,
    baVup = /(<@ba\.vup>)/g,
    baRem = /(<@ba\.rem>)/g,
    baKw = /(<@ba\.kw>)/g,
    baTalpu = /(<@ba\.talpu>)/g,
    lvItem = /<@lv\.(item|rem|fs)>/g;

  if (!reg1.test(desc) && !reg2.test(desc)) return desc;
  desc = desc
    .replace(reg1, '</i>')
    .replace(reg2, '<br/>')
    .replace(ccVup, '<i style="color:#0098DC;font-style: normal;">')
    .replace(ccVdown, '<i style="color:#FF6237;font-style: normal;">')
    // .replace(ccTalpu, '<i style="color:#FF6237;font-style: normal;">')
    // .replace(ccPn, '<i style="color:#FF6237;">')
    .replace(baPn, '<i style="color:#FF6237;">')
    .replace(baVdown, '<i style="color:#FF6237;font-style: normal;">')
    .replace(ccRem, '<i style="color:#F49800;font-style: normal;">')
    .replace(ccKw, '<i style="color:#00B0FF;font-style: normal;">')
    .replace(baVup, '<i style="color:#F49800;font-style: normal;">')
    .replace(baRem, '<i style="color:#F49800;font-style: normal;">')
    .replace(baKw, '<i style="color:#00B0FF;font-style: normal;">')
    .replace(baTalpu, '<i style="color:#F49800;font-style: normal;">')
    .replace(lvItem, '<i style="color:#049cb8;font-style: normal;">');

  return desc;
};


const getClass_icon = (c) => {
  return path + 'others/icon_profession_' + c.toLowerCase() + '.png';
};

import UaParser from 'ua-parser-js';


const Browser = () => new UaParser().getBrowser();
const isMoblie = () => new UaParser().getDevice().type === 'mobile';

const getWebpOk = () => {
  const ua = new UaParser();
  const OS = ua.getOS();
  const Browser = ua.getBrowser();
  const width = document.body.clientWidth;
  const isMoblie = ua.getDevice().type === 'mobile' || (OS.name === 'Mac OS' && width < 1300);
  // import { Message } from 'element-ui';
  // Message(`'is Moblie? ' ${isMoblie}, ${ua.getDevice().vendor}, os ${OS.name}`);

  if (
    OS.name === 'iOS' ||
    (OS.name === 'Mac OS' && Browser.name === 'Safari') ||
    (Browser.name === 'Edge' && Browser.version < '18')
  ) {
    return { ok: false, mobile: isMoblie };
  } else {
    return { ok: true, mobile: isMoblie };
  }
};

const webpOk = getWebpOk().ok;

const getProfilePath = name => {
  return webpOk ? `${path}char/profile/${name}_optimized.png?x-oss-process=style/small-test`
    : `${path}char/profile/${name}.png`;
};

const getDetailsProfilePath = name => {
  return webpOk ? `${path}char/profile/${name}_optimized.png?x-oss-process=style/profile-test`
    : `${path}char/profile/${name}.png`;
};

const changeKey = key => {
  const test = /_/.exec(key);
  if (test) {
    const temp = key.split('');
    temp.splice(test.index, 1);
    temp[test.index] = temp[test.index].toUpperCase();
    return temp.join('');
  } else {
    return key;
  }
};

const changeAttackSpeed = (skill) => {
  const str = changeDesc(skill.description);
  let res = str.replace(/(\{)(.*?)(\})/g, (match, p1, p2, p3, p4, p5) => {
    let percent = '',
      minus = false,
      res = '';
    if (p2.match(/:0%/)) {
      p2 = p2.slice(0, -3);
      percent = '%';
    }
    if (p2.match(/:0.0%/)) {
      p2 = p2.slice(0, -5);
      percent = '%';
    }
    if (p2.match(/:0.0/)) {
      p2 = p2.slice(0, -4);
      percent = '';
    }
    if (p2.match(/-/)) {
      p2 = p2.slice(1);
      minus = true;
    }
    let temp = skill.blackboard.find(el => el.key === p2.toLowerCase());
    if (temp) {
      res = temp.value;
      if (minus) res *= -1;
      if (percent) res = Math.floor(res * 10 * 10);
    }
    return res + percent;
  });
  const skill_time_text = res.match(/攻击间隔/);
  if (skill_time_text) {
    const skill_base_time = skill.blackboard.find(
      el => el.key === 'base_attack_time'
    );
    const text = res
      .slice(skill_time_text.index + 4)
      .match(/(<.*?>)(.*?)(<\/.*?>)/);

    let value = skill_base_time.value;
    const temp = res.split('');
    if (!text) {
      const tempIndex = (res.match('略微增大') ? 4 : 0) + 4;
      temp.splice(
        skill_time_text.index + tempIndex,
        0,
        `<i style="color:#F49800;font-style: normal;">(${value}s)</i>`
      );
    } else {
      const unit = text[2] !== '极大幅度缩短' ? 's' : '%';
      if (unit === '%') value *= 100;
      temp.splice(
        skill_time_text.index + 4 + text.index + text[0].length,
        0,
        `(${value}${unit})`
      );
    }

    res = temp.join('');
  }

  const skill_attack_speed = res.match(/攻击速度(?!<|\+|-)/);
  if (skill_attack_speed) {
    const attack_speed = skill.blackboard.find(
      el => el.key === 'attack_speed'
    );
    if (!attack_speed) return;
    const text = res
      .slice(skill_attack_speed.index + 4)
      .match(/(<.*?>)(.*?)(<\/.*?>)/);
    let value = attack_speed.value;
    const temp = res.split('');
    if (!text) {
      const tempIndex = (res.match('略微增大') ? 4 : 0) + 4;
      temp.splice(
        skill_attack_speed.index + tempIndex,
        0,
        `<i style="color:#F49800;font-style: normal;">(${value})</i>`
      );
    } else {
      temp.splice(
        skill_attack_speed.index + 4 + text.index + text[0].length,
        0,
        `(${value})`
      );
    }
    res = temp.join('');
  }
  const spUp = res.match(/技力回复速度/);
  if (spUp) {
    const temp = res.split('');
    const value = skill.blackboard.find(
      el => el.key === 'sp_recovery_per_sec'
    ).value;
    temp.splice(spUp.index + 6, 0,
      `<i style="color:#F49800;font-style: normal;">(${value * 100}%)</i>`
    );
    res = temp.join('');
  }

  return res;
};


const findStage = (map, tree) => {
  const splitTemp = map.split('_');
  let groupName = splitTemp[0];
  if (groupName === 'sub') groupName = 'main';
  const group = tree.find(
    el => el.label === StageType[groupName]
  );
  let target;
  if (group.label === '主线') {
    const chapter = splitTemp[1].split('-');
    if (splitTemp[0] === 'main') {
      const nodes = tree[0].children[+chapter[0]];
      target = nodes.children[+chapter[1] - 1];
    } else {
      //支线
      const temp = tree[0].children[+chapter[0]];
      const nodes = temp.children[temp.children.length - 1];
      target = nodes.children[+chapter[1] - 1];
    }
  } else {
    map = map.replace('wk', 'weekly').replace('pro', 'promote');
    target = group.children.find(el => el.path === map);
  }
  return target;
};


export {
  debounce,
  throttle,
  getHeroData,
  sort,
  sortByTime,
  getProfileList,
  getClass_Chinese,
  path,
  getClass_Short,
  class_chinese,
  fetchGet,
  changeDesc,
  getProfilePath,
  getDetailsProfilePath,
  getClass_icon,
  webpOk,
  Browser,
  getEnemyList,
  getEnemyData,
  getEneAppearMap,
  getDevList,
  isMoblie,
  getMapData,
  getMapDataListVer,
  changeKey,
  submitFeedback,
  changeAttackSpeed,
  getStageList,
  findStage
};


