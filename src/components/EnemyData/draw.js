import { Scene, Path, Label } from 'spritejs';
// pathfinding 被我手动把不需要的模块注释掉了，只有Grid和AStarFinder还在，体积从68kb变成了20kb，感动人心
import PF from 'pathfinding';
import { Directions } from '../../utils/string';
import { Notification } from 'element-ui';

const task = (title, message) => {
  return () => {
    Notification({
      title,
      message,
      position: 'top-right',
      type: 'warning'
    });
  };
};
const radio = 100;
const cen = radio / 2;

const mapBlockColoc = {
  [-1]: 'rgba(255,255,255, 0.2)',
  0: 'grey',
  1: '#fff',
  2: '#fff',
  3: 'rgb(244, 152, 0)',
  4: 'rgb(255, 61, 61)',
  5: 'rgb(103, 203, 67)',
  6: 'hsl(219, 57%, 14%)'
};

const react = `m 0 0 h ${radio - 2} v ${radio - 2} h ${-radio + 2} z`;
const mapReact = {
  d: react,
  lineCap: 'round',
};

const spwanMap = ({ map, tiles, branches }, np, paper, top) => {
  const myMap = map.map((el, row) => el.map((i, col) => {
    const { tileKey: key, passableMask, heightType, buildableType, blackboard } = tiles[i];
    const crossAble = /end/.test(key) ? 5 : /start/.test(key) ? 4 : /tel/.test(key) ? 3
      : /hole/.test(key) ? 6 : passableMask === 3 ? 1 : -1;
    const rc = [col, row];

    return {
      i,
      rc,
      crossAble,
      key,
      heightType,
      buildableType,
      passableMask,
      blackboard
    };
  }));

  np.forEach(el => {
    const { col, row } = el.position;
    myMap[myMap.length - 1 - row][col].data = el;
  });

  const Keys = {
    damage: '伤害',
    cd_min: '最小cd',
    cd_max: '最大cd',
    attack_speed: '攻速',
    atk_scale: '攻击倍率',
    def: '防御'
  };

  const Keys2 = {
    tile_volspread: '演讲喷射处',
    tile_volcano: '热泵通道',
    tile_gazebo: '防空符文',
    tile_corrosion: '腐蚀地表'
  };


  myMap.forEach((el) => el.forEach(({ rc, crossAble, heightType, buildableType, passableMask, data, key, blackboard }) => {
    const [col, row] = rc;
    const pos = [col * radio + 1, row * radio + 1];




    const valspread = 'tile_volspread' === key;
    const valcanno = 'tile_volcano' === key;
    const gazebo = 'tile_gazebo' === key;
    const corrosion = 'tile_corrosion' === key;

    const fillColor = gazebo ? 'hsl(48, 83%, 57%)' //防空符文
      : buildableType === 2 && heightType === 1 ? 'rgba(125, 253, 244, 0.9)'//高台能摆的格子
        : crossAble < 3 && buildableType === 0 && heightType === 0 && passableMask === 3 ? 'hsla(38, 92%, 90%, 1)'//地板不能摆的格子
          : valspread ? 'hsl(0, 100%, 24%)' //岩浆
            : valcanno ? 'hsla(25, 100%, 49%, 0.9)' //地板
              : corrosion ? 'hsl(179, 18%, 42%)' //腐蚀
                : heightType === 1 ? 'rgba(230,230,230, 0.5)'
                  : mapBlockColoc[crossAble];

    const mapBlock = new Path();

    const writeLabel = () => {
      const labelPos = [pos[0] + cen / 2, pos[1] + cen / 2];
      let text;
      if (col === 0 || row === 0) {
        if (col === 0 && row === 0) {
          labelPos[0] -= 10;
          text = 'Y|X';
        }
        else text = col === 0 ? myMap.length - 1 - row : col;
        const label = new Label(text);
        label.attr({
          pos: labelPos,
          fillColor: '#fff',
          font: 'bold 44px Arial',
        });
        paper.layer('map').append(label);
      } else if (data) {

        labelPos[1] -= 25;
        text = Directions[data.direction];
        const id = data.alias.split('#');
        if (id[1]) {
          const idLabel = new Label(id[1]);
          let pos = id[1] > 9 ? [labelPos[0] - 25, labelPos[1]] : labelPos;
          idLabel.attr({
            pos,
            fillColor: '#313131',
            font: 'bold 80px Arial',
          });
          paper.layer('map').append(idLabel);
        }
        const fillColor = 'rgba(255, 255, 255, 0.7)';
        const label = new Label(text);
        label.attr({
          pos: labelPos,
          fillColor,
          font: 'bold 80px Arial',
        });
        mapBlock.on('mouseenter', task('弩炮', `等级${data.inst.level} ，${branches ? '由敌人召唤，出现时间看梅菲斯特的技能' : '随敌人出现，出现时间参考出现敌人一栏'}`));
        paper.layer('map').append(label);

      }
    };


    const tempTask = blackboard ? task(Keys2[key], `${
      blackboard.reduce((res, el, index) => {
        return res + (index === 0 ? '' : ' ') + Keys[el.key] + ' ' + el.value;
      }, '')
    } `) : null;


    if (!top && heightType !== 1) {
      mapBlock.attr({
        pos,
        lineWidth: 1,
        path: mapReact,
        fillColor,
        strokeColor: 'rgb(64, 170, 191)'
      });
      paper.layer('map').append(mapBlock);
      writeLabel();

    } else if (!top) {
      mapBlock.attr({
        pos,
        lineWidth: 1,
        path: mapReact,
        fillColor: '#414141',
        strokeColor: 'rgb(64, 170, 191)'
      });
      paper.layer('map').append(mapBlock);

    } else if (top && heightType === 1) {
      mapBlock.attr({
        pos,
        lineWidth: 1,
        path: mapReact,
        fillColor,
        strokeColor: 'rgb(64, 170, 191)'
      });
      paper.layer('map').append(mapBlock);
      writeLabel();

      if (valspread || gazebo) {
        mapBlock.on('mouseenter', tempTask);
      }

    } else if (top) {
      // 高层代理时间的地板
      if (valcanno || corrosion) {
        mapBlock.attr({
          pos,
          path: mapReact,
          strokeColor: 'rgba(64, 170, 191, 0)'
        });
        paper.layer('map').append(mapBlock);
        mapBlock.on('mouseenter', tempTask);
      }
    }

  }));
  return myMap;
};

const sleep = time => {
  return new Promise(resolve => {
    setTimeout(() => resolve(), time);
  });
};





class Map {
  tempRoutes = {}
  runningRoutes = new Set();
  routeSet = new Set()
  pauseQueue
  grid
  map
  mapData
  finder = new PF.AStarFinder({
    allowDiagonal: true,
    dontCrossCorners: true,
    heuristic: PF.Heuristic.manhattan
  });
  paper
  mapRadio
  top
  run = false
  constructor(container, radio = 100, mapData = { width: 1600, height: 900 }, top = false) {
    const config = {
      viewport: ['auto', 'auto'],
      stickMode: 'width',
      resolution: [mapData.width * 100, mapData.height * 100]
    };
    this.paper = new Scene(container, config);
    this.mapRadio = radio;
    this.top = top;
    // 稍微做个判定，给以后用
    this.setDataBeta(mapData);
    const sMap = this.map.map(el => el.map(el => el.crossAble > -1 && el.crossAble < 5 ? 0 : 1));
    this.grid = new PF.Grid(sMap);
  }
  async ray(body) {
    return new Promise((resolve, reject) => {
      const { path, layer, color, time = 1000, saveTime = 0, stop } = body;
      if (stop) {
        const stopText = new Label(stop.time + 's');
        const height = this.grid.height - 1;
        const { col, row, reachOffset = { x: 0, y: 0 } } = stop.pos;

        const fillColor = `hsla(${color}, 75 %, 50 %, 0.7)`;
        const pos = [(col + reachOffset.x) * this.mapRadio, (height - row - reachOffset.y) * this.mapRadio];
        const mapBlock = new Path();
        mapBlock.attr({
          pos,
          lineWidth: 1,
          path: mapReact,
          fillColor
        });
        stopText.attr({
          pos,
          fillColor: 'rgb(255, 255, 255)',
          font: 'oblique small-caps bold 36px Arial',
          lineHeight: this.mapRadio,
          textAlign: 'center',
          width: this.mapRadio
        });
        layer.append(mapBlock);
        layer.append(stopText);


        resolve();
        return;
      }
      const pos = [0, 0];
      const s = new Path();
      const fullColors = [{
        offset: 0,
        color: `hsla(${color}, 100 %, 50 %, 0)`,
      }, {
        offset: 1,
        color: `hsla(${color}, 100 %, 50 %, 0)`,
      }];

      s.attr({
        pos,
        lineWidth: 6,
        path,
        lineCap: 'round',
        lineJoin: 'round',
        linearGradients: {
          strokeColor: {
            vector: [10, 30, 180, 90],
            colors: fullColors,
          },
        },
      });

      layer.append(s);
      const len = s.getPathLength();
      let [x, y] = path.split(' ').slice(1, 3);
      let start = null;
      const auto = (timeStamp) => {
        if (!start) start = timeStamp;
        const progress = timeStamp - start + saveTime;
        if (!this.run) {
          resolve(progress);
          return;
        }

        let q = 0;
        let p = Math.min(progress / time, 1);
        if (p > 0.618) {
          q = 1 - (1 - p) / 0.382;
        }
        p = Math.min(p / 0.7, 1);

        const colors = [
          { offset: 0, color: `hsla(${color}, 100 %, 50 %, 0.1)` },
          { offset: q, color: `hsla(${color}, 100 %, 50 %, 0.7)` },
          { offset: p, color: `hsla(${color}, 100 %, 35 %, 1)` },
          { offset: Math.min(p + 0.06, 1), color: `hsla(${color}, 100 %, 50 %, 0)` },
        ];

        const linearGradients = s.attr('linearGradients');
        linearGradients.strokeColor.colors = colors;
        const [newX, newY] = s.getPointAtLength(p * len);
        linearGradients.strokeColor.vector = [x, y, newX, newY];
        s.attr({ linearGradients });

        if (progress < time) {
          requestAnimationFrame(auto);
        } else {
          resolve();
        }
      };

      requestAnimationFrame(auto);
    });
  }

  setDataBeta(rowData) {
    const { mapData, predefines } = rowData;
    const np = predefines ? predefines.tokenInsts : [];
    this.mapData = mapData;
    this.paper.setResolution(mapData.width * this.mapRadio, mapData.height * this.mapRadio);
    this.map = spwanMap(mapData, np, this.paper, this.top);
  }
  setData(mapData) {
    this.clearRoutes();
    this.paper.children.forEach(el => this.paper.removeChild(el));
    // 清完再设置
    this.setDataBeta(mapData);
    const sMap = this.map.map(el => el.map(el => el.crossAble > -1 && el.crossAble < 5 ? 0 : 1));
    this.grid = new PF.Grid(sMap);
  }

  loadMap() {
    this.map = spwanMap(this.mapData, this.paper);
  }

  spwanPathAlpha(path) {
    // console.log(path);
    const temp = path.map((cur, index, arr) => {
      const [x, y] = cur;
      if (index === 0) return { row: y, col: x };

      const [preX, preY] = arr[index - 1];
      return { row: y - preY, col: x - preX };
    });
    console.log('??');
    const radio = this.mapRadio, cen = this.mapRadio / 2;
    return temp.reduce((path, { row, col }, index) => {
      if (index === 0) return `m ${col * radio + cen} ${row * radio + cen} `;
      if (row === 0) return `${path} h ${col * radio} `;
      if (col === 0) return `${path} v ${row * radio} `;
      return `${path} l ${col * radio} ${row * radio} `;
    }, '');
  }
  deleteRoute(x) {
    this.runningRoutes.delete(x);
    delete this.tempRoutes[x];
  }
  addRoutes(route, id, color) {
    //可以接受Array或者Number
    this.runningRoutes.add(id);
    const height = this.grid.height - 1;

    const { startPosition: startPos, endPosition: endPos, checkpoints } = route;
    const pathPoints = checkpoints.filter(el => {
      return el.type < 4 || el.type === 6;
    });
    const path = pathPoints.map(el => ({ ...el.position, type: el.type, reachOffset: el.reachOffset }));

    if (path.length === 0 || startPos.row !== path[0].row || startPos.col !== path[0].col) path.unshift(startPos);
    if (path.length === 0 || endPos.row !== path[path.length - 1].row || endPos.col !== path[path.length - 1].col) path.push(endPos);

    const tempGrid = route.motionMode !== 1 ? this.grid.clone() : new PF.Grid(this.grid.width, this.grid.height);
    tempGrid.setWalkableAt(endPos.col, height - endPos.row, true);

    const splitPath = path.reduce((res, cur, index, arr) => {
      if (index + 1 === arr.length) return res;
      let { col, row } = cur;
      let { col: nCol, row: nRow, reachOffset } = arr[index + 1];

      // 现在的点是空的，或者是隧道出口，跳过
      if ((col === 0 && row === 0) || arr[index + 1].type === 6) return res;
      // 下一个点是空的，且下下个点不是隧道出口，则这个点就是停止点，顺位到下下下个点，因为前面把type5，也就是进隧道的点过滤了，只有出隧道的点。
      if (nCol === 0 && nRow === 0 && arr[index + 2].type !== 6) {
        nRow = arr[index + 2].row;
        nCol = arr[index + 2].col;
        reachOffset = arr[index + 2].reachOffset;
        const time = pathPoints[index].time ? pathPoints[index].time : pathPoints[index + 1].time;

        res.push({ stop: { pos: cur, time } });
      }

      // 颠倒y 从图例左下角为（0， 0），变为canvas坐标系，左上角（0， 0）
      row = height - row;
      nRow = height - nRow;

      const ttGrid = tempGrid.clone();

      // 不拐弯直走逻辑，危险，待测试。检测两点之间是都有便宜，如果是，就不寻路
      const path = reachOffset && cur.reachOffset && (reachOffset.x !== 0 || reachOffset.y !== 0) && (cur.reachOffset.x !== 0 || cur.reachOffset.y !== 0) ?
        [[col, row], [nCol, nRow]] : PF.Util.compressPath(this.finder.findPath(col, row, nCol, nRow, ttGrid));


      if (path.length > 0 && reachOffset) {
        path[path.length - 1][0] += reachOffset.x;
        path[path.length - 1][1] -= reachOffset.y;
      }

      // 擦墙逻辑，如果找不到路，但是点不是隧道出口， 且下一个点有reachOffset，x,y 不等于0，就擦墙看看，在of1是可以和下一段的起点连上的。
      if (path.length === 0 && arr[index + 2].type !== 6 && reachOffset.x !== 0 && reachOffset.y !== 0) {
        path.push([col, row]);
        path.push([nCol + reachOffset.x, nRow - reachOffset.y]);
      }
      path.forEach((el, index, arr) => {

        if (index + 1 < arr.length) {
          let [x, y] = el;
          if (index === 0 && cur.reachOffset) {
            x += cur.reachOffset.x;
            y -= cur.reachOffset.y;
          }

          const next = arr[index + 1];
          const len = Math.sqrt((x - next[0]) ** 2 + (y - next[1]) ** 2);
          res.push({ path: this.spwanPathAlpha([[x, y], next]), time: len * 200 });
        }
      });
      return res;
    }, []);

    this.tempRoutes[id] = ({
      splitPath,
      index: id,
      color,
    });
    this.routeSet.add(splitPath);


    if (!this.run) {
      this.run = true;
      this.loopRoutes();
    }
  }

  clearRoutes() {
    this.run = false;
    this.runningRoutes.clear();
    this.tempRoutes = {};

  }
  loopRoutes() {
    const loop = () => {
      const queue = Object.values(this.tempRoutes);
      if (queue.length < 1) {
        this.run = false;
        return;
      }
      const tasks = this.pauseQueue ? this.pauseQueue : queue.map(el => ({ ...el, layer: this.paper.layer(el.index) }));

      if (this.pauseQueue) {
        // 恢复暂停之前的动画先清空保留画面
        tasks.forEach(el => {
          el.layer.remove();
          el.layer = this.paper.layer(el.index);
        });
      }

      const tasksToPromises = tasks.map(el => {
        return new Promise(async resolve => {
          const { splitPath, layer, color } = el;
          for (const { path, time, stop } of splitPath) {
            await this.ray({ path, layer, color, time, stop });
          }
          resolve();
        });
      });


      Promise.all(tasksToPromises)
        .then(async (saveTimes) => {
          // console.log('complete');
          saveTimes = saveTimes.filter(el => el);
          if (saveTimes.length > 0) {
            console.log('stop quene', saveTimes);
            tasks.forEach((el, index) => {
              el.saveTime = saveTimes[index];
            });
            this.pauseQueue = tasks;
          } else {
            await sleep(500);
            tasks.forEach(el => {
              el.layer.remove();
            });
            if (this.pauseQueue) this.pauseQueue = null;
          }
          loop();
          // this.run = false;
        });
    };
    loop();
  }
}

export {
  Map
};
