import store from '../store';
import { getStageType, statusToChChar } from './string';
import { path } from './listVer';
import { getHeroData, getSkill } from './fetch';

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
  let last = 0;
  // 传的参数是类似requestAnimationFrame的TimeEvent
  return function (event) {
    let curr = event.timeStamp;
    if (curr - last > delay) {
      console.log(event);
      action(event);
      last = curr;
    }
  };
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

class TaskQueue {
  constructor(concurrency, finalTask = () => { }, queue = []) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = queue;
    this.finalTask = finalTask;

    return this;
  }

  pushTask(task) {
    this.queue.push(task);
    this.next();
  }

  next() {
    while (this.running < this.concurrency && this.queue.length) {
      const task = this.queue.shift();
      task().then(() => {
        this.running--;
        this.next();
      });
      this.running++;
    }
    if (this.running === 0 && this.queue.length === 0) {
      console.log('Task is over');
      this.finalTask();
    }
  }
}


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
    lvItem = /<@lv\.(item|rem|fs)>/g,
    timeLimit = /<@act\.timeLimit>/g;


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
    .replace(lvItem, '<i style="color:#049cb8;font-style: normal;">')
    .replace(timeLimit, '<i style="color:hsl(20, 100%, 50%);font-style: normal;">');


  return desc;
};


const getClass_icon = (c) => {
  return path + 'others/icon_profession_' + c.toLowerCase() + '.png';
};

import UaParser from 'ua-parser-js';


// import { Message } from 'element-ui';
const getUA = () => {
  const ua = new UaParser();
  const OS = ua.getOS();
  const Browser = ua.getBrowser();
  const width = document.body.clientWidth;
  const isMoblie = ua.getDevice().type === 'mobile';
  const isMobliePad = isMoblie || OS.name === 'iOS' || (OS.name === 'Mac OS' && width < 1300);
  // Message(`'is Moblie? ' ${isMoblie}, ${ua.getDevice().vendor}, os ${OS.name}`);

  return {
    isMoblie,
    Browser,
    ok: !(OS.name == 'iOS' ||
      (OS.name === 'Mac OS' && Browser.name === 'Safari') ||
      (Browser.name === 'Edge' && Browser.version < '18')),
    isMobliePad
  };
};

const UA = getUA();

window.addEventListener('resize', throttle(() => {
  const w = document.body.clientWidth;
  store.commit('setShort', w < 600 ? true : false);
  store.commit('setScreenWidth', w);
}, 500));


const getProfilePath = name => {
  return UA.ok ? `${path}char/profile/${name}_optimized.png?x-oss-process=style/small-test`
    : `${path}char/profile/${name}.png`;
};

const getDetailsProfilePath = name => {
  return UA.ok ? `${path}char/profile/${name}_optimized.png?x-oss-process=style/profile-test`
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
  if (skill_time_text && !new RegExp(`/攻击间隔(.{2,}${Math.abs(skill_time_text.value)})/`).test(res)) {
    const skill_base_time = skill.blackboard.find(
      el => el.key === 'base_attack_time'
    );
    const text = res
      .slice(skill_time_text.index + 4)
      .match(/(<.*?>)(.*?)(<\/.*?>)/);

    let value = skill_base_time.value;
    const temp = res.split('');
    // 有text的话，直接按匹配的长度弄就好
    if (!text) {
      // throw new Error('攻击间隔的正则匹配出问题');
      const tempIndex = (res.match('略微增大') ? 4 : 0) + 4;

      temp.splice(
        skill_time_text.index + tempIndex,
        0,
        `<i style="color:#F49800;font-style: normal;">(${value}s)</i>`
      );
    } else {
      let unit = 's';
      const absV = Math.abs(value);
      if (absV === 0.7 || absV === 0.15) {
        value = value * 10 * 10;
        unit = '%';
      }
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
    if (attack_speed && !new RegExp(`/攻击速度(.{2,}${Math.abs(attack_speed.value)})/`).test(res)) {
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

const calStatus = (lv, data) => {
  return data.reduce((zero, max) => {
    const diff = max.level - zero.level;
    const res = Object.entries(max.data).reduce((res, cur) => {
      const [k, v] = cur;
      res[k] = Math.round((v - zero.data[k]) / diff * (lv - 1)) + zero.data[k];
      return res;
    }, {});
    return res;
  });
};

const calStatusEnd = (baseData, level, targetPhasese, isFavor, potentailStatusUP) => {
  const data = calStatus(level, targetPhasese);
  return Object.entries(data).reduce((res, cur) => {
    // 判定是否显示属性，没有就是我看不懂，或者觉得没意义的
    const [key, value] = cur;
    if (!statusToChChar(key)) return res;
    let nV = value, addV = 0;
    // 判定是是否满好感
    if (isFavor && baseData.favorKeyFrames) {
      const v = baseData.favorKeyFrames[1].data[key];
      if (v !== 0) {
        addV += v;
        nV += v;
      }
    }
    // 判定潜能提升
    potentailStatusUP.forEach(el => {
      el.forEach(el => {
        if (el.type === key) {
          if (key === 'baseAttackTime') {
            addV += el.value;
            nV = Math.floor((nV / (el.value / 100 + 1)) * 100) / 100;
          } else {
            addV += el.value;
            nV += el.value;
          }
        }
      });
    });
    const upOrMinus = addV > 0 ? '+' : '';
    if (addV) nV = nV + '<i style="color: #F49800;font-style: normal;">(' + upOrMinus + addV + ')</i>';
    res[key] = nV;
    return res;
  }, {});
};

const preDefineCompute = (asyncData, baseData) => {
  const res = baseData.map(el => {
    const key = el.inst.characterKey;
    const target = asyncData.find(item => key === item.key);

    if (!target) return;
    const { data, targetSkill } = target;
    const targetData = calStatus(el.inst.level, data.phases[el.inst.phase].attributesKeyFrames);
    return { key, targetData, targetSkill, ...data, ...el };
  });
  return res.filter(el => el);
};

const preDefineGet = async (key, baseData) => {
  const temp = baseData[key].reduce((res, cur) => res.add(cur.inst.characterKey), new Set());
  if (temp.length === 0) return [];
  const res = await Promise.all([...temp].map(key => getHeroData(key).then(data => ({ key, data }))));
  for (const char of res) {
    const base = baseData[key].find(el => el.inst.characterKey === char.key);
    const targetSkill = char.data.skills[base.skillIndex];
    if (targetSkill) {
      const skillKey = targetSkill.skillId;
      char.targetSkill = [await getSkill(skillKey)];
    }
  }
  return preDefineCompute(res, baseData[key]);
};

const bsr = (t, a1, a2, a3, a4) => a1 * (1 - t) * (1 - t) * (1 - t) + 3 * a2 * t * (1 - t) * (1 - t) + 3 * a3 * t * t * (1 - t) + a4 * t * t * t;

const findStage = (map, tree) => {
  const splitTemp = map.split('_');
  let groupName = splitTemp[0];
  if (groupName === 'sub') groupName = 'main';
  const group = tree.find(
    el => el.label === getStageType(groupName)
  );
  let target;
  if (group.label === '主线') {
    const chapter = splitTemp[1].split('-');
    if (splitTemp[0] === 'main') {
      target = group.children[+chapter[0]].children.find(el => el.path === map);
    } else {
      //支线
      const temp = group.children[+chapter[0]];
      target = temp.children[temp.children.length - 1].children.find(el => el.path === map);
    }
  } else {
    map = map.replace('wk', 'weekly').replace('pro', 'promote');
    target = group.children.find(el => el.path === map);
  }
  return target;
};



export {
  TaskQueue,

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

  // 转换路径类，可能需要转义到string
  getProfilePath,
  getDetailsProfilePath,
  getClass_icon,

  // 设备检测
  UA,
  changeKey,
};
