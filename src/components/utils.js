const debounce = function (action, idle) {
  var last;
  return function () {
    var ctx = this,
      args = arguments;
    clearTimeout(last);
    last = setTimeout(function () {
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

const path = 'https://arknights-data.oss-cn-beijing.aliyuncs.com/dataX/';

const insertImg = (picArr, baseImg) => {
  return new Promise((resolve, reject) => {
    if (picArr.length === 0) {
      return;
    }
    for (const rect of picArr) {
      const canvas = makeNewCanvas(rect, baseImg);
      let name = rect.id.split('-')[1];

      canvas.toBlob(blob => {
        const imgContainer = new Image();
        imgContainer.style.width = '100%';

        imgContainer.onload = function () {
          console.log(imgContainer);
        };
        imgContainer.src = URL.createObjectURL(blob);
        console.log(name);
        if (name === 'skill') {
          const id = rect.id.split('-')[2];
          name = 'skill-' + id;
        }

        const container = document.querySelector('#' + name);
        if (!container) reject('id error');
        removeChildNode(container);
        container.appendChild(imgContainer);

        resolve({ id: 'pic-' + name, blob });
        function removeChildNode(container) {
          if (container.childNodes.length > 0) {
            container.childNodes.forEach(node => node.remove());
          }
        }
      });

    }
  });

};


const makeNewCanvas = (rect, img, callback) => {
  const _canvas = document.createElement('canvas'),
    r = img.width / 1280,
    ctx = _canvas.getContext('2d');

  _canvas.width = rect.width * r;
  _canvas.height = rect.height * r;

  ctx.drawImage(
    img,
    rect.x * r,
    rect.y * r,
    rect.width * r,
    rect.height * r,
    0,
    0,
    _canvas.width,
    _canvas.height
  );
  let dataURL = _canvas.toDataURL();
  const id = rect.id;
  if (callback) {
    callback(id, dataURL);
  }
  return _canvas;

};


const getProfileList = () => {
  return fetchGet('/api/arknights/data/shortList')
    .then(res => fetchGet('https' + res.url.slice(4)))
    .catch(err => {
      console.log(err);
      return [];
    });
};

const getEnemyList = () => {
  return fetchGet('/api/arknights/data/enemyList')
    .then(res => fetchGet('https' + res.url.slice(4)))
    .catch(err => {
      console.log(err);
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

//包装fetch，使用get
const fetchGet = (url) => {
  return fetch(url, {
    method: 'GET'
  }).then(res => {
    if (res.ok)
      return res.json();
    else
      return Promise.reject('server error');
  });
};


function sort(array, less) {

  function swap(i, j) {
    var t = array[i];
    array[i] = array[j];
    array[j] = t;
  }

  function quicksort(left, right) {

    if (left < right) {
      var pivot = array[left + Math.floor((right - left) / 2)],
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

const TagsArr = [
  { isTag: true, text: '治疗', value: '治疗', short: '治疗' },
  { isTag: true, text: '支援', value: '支援', short: '支援' },
  { isTag: true, text: '新手', value: '新手', short: '新手' },
  { isTag: true, text: '费用回复', value: '费用回复', short: '费用回复' },
  { isTag: true, text: '输出', value: '输出', short: '输出' },
  { isTag: true, text: '生存', value: '生存', short: '生存' },
  { isTag: true, text: '防护', value: '防护', short: '防护' },
  { isTag: true, text: '群攻', value: '群攻', short: '群攻' },
  { isTag: true, text: '减速', value: '减速', short: '减速' },
  { isTag: true, text: '削弱', value: '削弱', short: '削弱' },
  { isTag: true, text: '快速复活', value: '快速复活', short: '快速复活' },
  { isTag: true, text: '位移', value: '位移', short: '位移' },
  { isTag: true, text: '召唤', value: '召唤', short: '召唤' },
  { isTag: true, text: '爆发', value: '爆发', short: '爆发' },
  { isTag: true, text: '控场', value: '控场', short: '控场' }];

const StarArr = [
  { isTag: false, text: 1, value: '0', short: 1 },
  { isTag: false, text: 2, value: '1', short: 2 },
  { isTag: false, text: 3, value: '2', short: 3 },
  { isTag: false, text: 4, value: '3', short: 4 },
  { isTag: false, text: 5, value: '4', short: 5 },
  { isTag: false, text: 6, value: '5', short: 6 },];


const evolveGoldCost = [
  [
    -1,
    -1
  ],
  [
    -1,
    -1
  ],
  [
    10000,
    -1
  ],
  [
    15000,
    60000
  ],
  [
    20000,
    120000
  ],
  [
    30000,
    180000
  ]
];

const changeDesc = (desc) => {
  const reg1 = /(<\/>)/g,
    reg2 = /\\n/g,
    ccVup = /(<@cc.vup>)/g,
    ccVdown = /(<@cc.vdown>)/g,
    ccRem = /(<@cc.rem>)/g,
    ccKw = /(<@cc.kw>)/g,
    ccPn = /(<@cc.pn>)/g,
    ccTalpu = /(<@cc.talpu>)/g,
    baVup = /(<@ba.vup>)/g,
    baVdown = /(<@ba.vdown>)/g,
    baRem = /(<@ba.rem>)/g,
    baKw = /(<@ba.kw>)/g,
    baTalpu = /(<@ba.talpu>)/g,
    baPn = /(<@ba.pn>)/g;

  if (!reg1.test(desc)) return desc;
  desc = desc
    .replace(reg1, '</i>')
    .replace(reg2, '<br/>')
    .replace(ccVup, '<i style="color:#0098DC;font-style: normal;">')
    .replace(ccVdown, '<i style="color:#FF6237;font-style: normal;">')
    .replace(ccRem, '<i style="color:#F49800;font-style: normal;">')
    .replace(ccKw, '<i style="color:#00B0FF;font-style: normal;">')
    .replace(ccPn, '<i style="color:#FF6237;">')
    .replace(ccTalpu, '<i style="color:#FF6237;font-style: normal;">')
    .replace(baVup, '<i style="color:#F49800;font-style: normal;">')
    .replace(baVdown, '<i style="color:#FF6237;font-style: normal;">')
    .replace(baRem, '<i style="color:#F49800;font-style: normal;">')
    .replace(baKw, '<i style="color:#00B0FF;font-style: normal;">')
    .replace(baTalpu, '<i style="color:#F49800;font-style: normal;">')
    .replace(baPn, '<i style="color:#FF6237;">');

  return desc;
};

const potentialToStatus = {
  0: 'maxHp',
  1: 'atk',
  2: 'def',
  3: 'magicResistance',
  4: 'cost',
  5: 'blockCnt',
  7: 'baseAttackTime',
  21: 'respawnTime'
};

const itemBackground = {
  0: {
    'border-color': 'rgb(160, 160, 160)',
    'background-color': 'rgb(157, 157, 157)',
    'box-shadow': `rgb(5, 1, 0) 0px 0px 0px 2px inset, 
                   rgb(164, 164, 164) 0 0 5px 4px inset,
                   0 0 1px 0px rgba(128, 128, 128, 0.37)`
  },
  1: {
    'border-color': 'rgb(160, 160, 160)',
    'background-color': 'rgb(157, 157, 157)',
    'box-shadow': `rgb(5, 1, 0) 0px 0px 0px 2px inset, 
                   rgb(164, 164, 164) 0 0 5px 4px inset,
                   0 0 1px 0px rgba(128, 128, 128, 0.37)`
  },
  2: {
    'border-color': 'rgb(9, 177, 242)',
    'background-color': 'rgb(165, 165, 165)',
    'box-shadow': `rgb(3, 0, 0) 0px 0px 0px 2px inset, 
                   rgb(165, 165, 165)' 0 0 5px 4px inset,
                   0 0 1px 0px rgba(128, 128, 128, 0.37)`
  },
  3: {
    'border-color': 'rgb(215, 198, 216)',
    'background-color': 'rgb(128, 128, 128)',
    'box-shadow': `rgb(44, 29, 62) 0px 0px 0px 2px inset, 
                  rgb(110, 107, 116) 0px 0px 5px 4px inset,
                   0 0 1px 0px rgba(128, 128, 128, 0.37)`
  },
  4: {
    'border-color': 'rgb(251, 201, 17)',
    'background-color': 'grey',
    'box-shadow': `rgb(51, 41, 6) 0px 0px 0px 2px inset, 
                   rgb(153, 138, 88) 0 0 5px 4px inset,
                   0 0 1px 0px rgba(128, 128, 128, 0.37)`
  },
  5: {
    'border-color': 'rgb(75, 41, 23)',
    'background-color': 'rgb(247, 212, 139)',
    'box-shadow': `rgb(75, 41, 23) 0px 0px 0px 2px inset, 
                  rgb(250, 215, 138) 0 0 5px 4px inset,
                  0 0 1px 0px rgba(128, 128, 128, 0.37)`
  },
};

const GOLD = {
  itemId: '4001',
  name: '龙门币',
  description: '经济危机发生后，经济的衰退与政权之间的对立让贸易参与者们举步维艰。龙门币的流通使商业复兴成为可能。',
  rarity: 3,
  iconId: 'GOLD',
  overrideBkg: null,
  stackIconId: 'GOLD_STACK',
  sortId: 4,
  usage: '由龙门发行的货币，用途广泛。',
  obtainApproach: null,
  itemType: 'GOLD',
  stageDropList: [
    {
      stageId: 'wk_melee_1',
      occPer: 'ALWAYS'
    },
    {
      stageId: 'main_01-01',
      occPer: 'ALWAYS'
    },
    {
      stageId: 'sub_02-02',
      occPer: 'ALWAYS'
    },
    {
      stageId: 'main_02-07',
      occPer: 'ALWAYS'
    },
    {
      stageId: 'main_03-06',
      occPer: 'ALWAYS'
    },
    {
      stageId: 'main_04-01',
      occPer: 'ALWAYS'
    },
    {
      stageId: 'sub_04-2-3',
      occPer: 'ALWAYS'
    }
  ],
  buildingProductList: []
};

const occPer_chinese = {
  ALWAYS: '固定掉落',
  SOMETIMES: '罕见',
  OFTEN: '小概率',
  USUAL: '概率掉率',
  ALMOST: '大概率'
};

const roomType = {
  WORKSHOP: '加工站',
  MANUFACTURE: '制造站'
};

const exp_cards = {
  2001: {
    exp: 200,
    itemId: '2001',
    name: '基础作战记录',
    description: '在恶劣环境下的每次行动都可能有人会丢掉性命。如果做好了充足的准备，或许也能多拯救一些生命。\\n存储了数场战斗的录像。',
    rarity: 1,
    iconId: 'sprite_exp_card_t1',
    overrideBkg: null,
    stackIconId: 'sprite_exp_card_stack_t1',
    sortId: 15,
    usage: '记录了作战录像的存储装置，可以些微增加干员的经验值。',
    obtainApproach: null,
    itemType: 'CARD_EXP',
    stageDropList: [
      {
        stageId: 'wk_kc_1',
        occPer: 'ALWAYS'
      },
      {
        stageId: 'sub_02-03',
        occPer: 'ALWAYS'
      },
      {
        stageId: 'main_00-10',
        occPer: 'ALWAYS'
      }
    ],
    buildingProductList: [
      {
        roomType: 'MANUFACTURE',
        formulaId: '1'
      }
    ]
  },
  2002: {
    exp: 400,
    itemId: '2002',
    name: '初级作战记录',
    description: '在恶劣环境下的每次行动都可能有人会丢掉性命。如果做好了充足的准备，或许也能多拯救一些生命。\\n存储了多场战斗的录像与详细数据分析资料。附送了三小时的花絮与访谈。',
    rarity: 2,
    iconId: 'sprite_exp_card_t2',
    overrideBkg: null,
    stackIconId: 'sprite_exp_card_stack_t2',
    sortId: 14,
    usage: '记录了作战录像的存储装置，可以少许增加干员的经验值。',
    obtainApproach: null,
    itemType: 'CARD_EXP',
    stageDropList: [
      {
        stageId: 'wk_kc_1',
        occPer: 'ALWAYS'
      },
      {
        stageId: 'main_03-05',
        occPer: 'ALWAYS'
      },
      {
        stageId: 'sub_02-10',
        occPer: 'ALWAYS'
      }
    ],
    buildingProductList: [
      {
        roomType: 'MANUFACTURE',
        formulaId: '2'
      }
    ]
  },
  2003: {
    exp: 1000,
    itemId: '2003',
    name: '中级作战记录',
    description: '在恶劣环境下的每次行动都可能有人会丢掉性命。如果做好了充足的准备，或许也能多拯救一些生命。\\n存储了多个录像集锦，夹带了一张录像人的签名版。',
    rarity: 3,
    iconId: 'sprite_exp_card_t3',
    overrideBkg: null,
    stackIconId: 'sprite_exp_card_stack_t3',
    sortId: 13,
    usage: '记录了作战录像的存储装置，可以大幅增加干员的经验值。',
    obtainApproach: null,
    itemType: 'CARD_EXP',
    stageDropList: [
      {
        stageId: 'wk_kc_1',
        occPer: 'ALWAYS'
      },
      {
        stageId: 'main_04-03',
        occPer: 'ALWAYS'
      },
      {
        stageId: 'sub_04-3-3',
        occPer: 'ALWAYS'
      }
    ],
    buildingProductList: [
      {
        roomType: 'MANUFACTURE',
        formulaId: '3'
      }
    ]
  },
  2004: {
    exp: 2000,
    itemId: '2004',
    name: '高级作战记录',
    description: '在恶劣环境下的每次行动都可能有人会丢掉性命。如果做好了充足的准备，或许也能多拯救一些生命。\\n追加了总集篇。附带高清版、高清重制版、威力加强版、导演剪辑版、年度黄金版……',
    rarity: 4,
    iconId: 'sprite_exp_card_t4',
    overrideBkg: null,
    stackIconId: 'sprite_exp_card_stack_t4',
    sortId: 12,
    usage: '记录了作战录像的存储装置，可以极大增加干员的经验值。',
    obtainApproach: null,
    itemType: 'CARD_EXP',
    stageDropList: [
      {
        stageId: 'wk_kc_1',
        occPer: 'ALWAYS'
      }
    ],
    buildingProductList: []
  },
};



const getClass_icon = (c) => {
  return path + 'others/icon_profession_' + c.toLowerCase() + '.png';
};

import UaParser from 'ua-parser-js';

const ua = new UaParser();
const OS = ua.getOS();
const Browser = ua.getBrowser();

const getWebpOk = () => {
  console.log(OS);
  console.log(Browser);
  if (
    OS.name === 'iOS' ||
    (OS.name === 'Mac OS' && Browser.name === 'Safari') ||
    (Browser.name === 'Edge' && Browser.version < '18')
  ) {
    return false;
  } else {
    return true;
  }
};

const webpOk = getWebpOk();


const getProfilePath = name => {
  return webpOk ? `${path}char/profile-compress/${name}.png?x-oss-process=style/small-test`
    : `${path}char/profile-compress/${name}.png`;
};

const getDetailsProfilePath = name => {
  return webpOk ? `${path}char/profile/${name}.png?x-oss-process=style/profile-test`
    : `${path}char/profile/${name}.png`;
};



export {
  debounce,
  throttle,
  insertImg,
  getHeroData,
  sort,
  sortByTime,
  getProfileList,
  getClass_Chinese,
  TagsArr,
  StarArr,
  path,
  getClass_Short,
  class_chinese,
  fetchGet,
  evolveGoldCost,
  changeDesc,
  potentialToStatus,
  itemBackground,
  GOLD,
  occPer_chinese,
  roomType,
  exp_cards,
  getProfilePath,
  getDetailsProfilePath,
  getClass_icon,
  webpOk,
  Browser,
  getEnemyList,
  getEnemyData
};


