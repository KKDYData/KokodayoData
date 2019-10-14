import { Scene, Path, Label } from 'spritejs';
import PF from 'pathfinding';
import { Directions, blockKeys, tileInfo } from '../../utils/string';
import { Notification } from 'element-ui';
import { UA, sort } from '../../utils';

console.log('draw.js');

const radio = 100;
const cen = radio / 2;
const react = `m 0 0 h ${radio - 2} v ${radio - 2} h ${-radio + 2} z`;
const mapReact = {
  d: react,
  lineCap: 'round',
};

const abs = Math.abs;

let noti, notiTime;

const task = (mapBlock, mapData, heightType) => {
  return () => {
    let rightTrans = null;
    notiTime = +new Date();
    if (!noti || noti.closed) {
      noti = Notification({
        ...mapData,
        position: UA.Browser.name === 'Mobile Safari' ? 'bottom-right' : 'top-right',
        type: 'warning',
        duration: 0
      });
    } else {
      noti.closed = false;
      noti.message = mapData.message;
      noti.title = mapData.title;
    }
    rightTrans = mapBlock.transition(0.7);
    rightTrans.attr({
      fillColor: 'rgba(92, 222, 255, 0.5)'
    });
    setTimeout(() => {
      // 颜色强制复原
      mapBlock.attr({ fillColor: heightType !== 1 ? 'rgba(0, 0, 0, 0)' : mapData.color });
      if (UA.isMobliePad) {
        if (+ new Date - notiTime > 3000) {
          noti.close();
        }
      }
    }, 3000);
    mapBlock.on('mouseleave', (evt) => {
      rightTrans.reverse();
      noti.close();
    });
  };
};

const comparePoint = (x1, y1, x2, y2) => x1 === x2 && y1 === y2; //arr.slice(index + 1).filter(el => el.type !== 3).length !== 1;



const getBlockData = (data, key, blackboard) => {
  // 预设已经下场的地板
  if (data) {
    return {
      color: 'rgba(230,230,230, 0.5)'
    };
  } else if (tileInfo[key]) {
    const { description, name: title, color } = tileInfo[key];
    return {
      title,
      color,
      message: description + (blackboard ? `， ${blackboard.reduce((res, el, index) => res + (index === 0 ? '' : ' ') + blockKeys(el.key) + ' '
        + el.value + (el.key.indexOf('cd') > -1 ? 's' : ''), '')}`
        : ''),
    };
  } else return {
    color: 'rgba(0, 0, 0, 0)'
  };
};


const spawnMap = ({ map, tiles, branches }, np, paper, top) => {
  const myMap = map.map((el, row) => el.map((i, col) => {
    const { tileKey: key, passableMask, heightType, buildableType, blackboard } = tiles[i];
    // 只剩下计算是否同行的作用了
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
    if (!myMap[myMap.length - 1 - row]) {
      console.log('数据异常');
    } else {
      const target = myMap[myMap.length - 1 - row][col];
      if (target) {
        target.data = el;
      } else {
        console.log('数据异常');
      }
    }
  });

  myMap.forEach((el) => el.forEach(({ rc, heightType, data, key, blackboard }) => {
    const [col, row] = rc;
    const pos = [col * radio + 1, row * radio + 1];

    const mapBlock = new Path();

    const typeData = getBlockData(data, key, blackboard);
    const fillColor = typeData.color;

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

        let id, temp, arrow = false;
        const idConfig = {
          fillColor: '#313131',
          font: 'bold 80px Arial',
        };
        // 画箭头和它的序号
        if (data.alias) {
          temp = data.alias.split('#');
          if (temp[1]) id = temp[1];
          else id = '';
          arrow = true;
        } else if (data.inst) {
          id = data.name;
          idConfig.font = 'bold 25px Arial';
        }
        // 大于2是扫描器这类的东西
        idConfig.pos = id.length > 1 ? id.length > 2 ? [labelPos[0] - 20, labelPos[1] + 25]
          : [labelPos[0] - 20, labelPos[1]] : labelPos;
        const idLabel = new Label(id);
        idLabel.attr(idConfig);
        paper.layer('map').append(idLabel);

        if (arrow) {
          const fillColor = 'rgba(255, 255, 255, 0.7)';
          const label = new Label(text);
          label.attr({
            pos: labelPos,
            fillColor,
            font: 'bold 80px Arial',
          });
          paper.layer('map').append(label);
        }
      }
    };

    const mapBlockConfig = {
      pos,
      lineWidth: 1,
      path: mapReact,
      fillColor,
      strokeColor: 'rgb(64, 170, 191)'
    };
    let isWL = false;

    if (!top && heightType !== 1 || top && heightType === 1) {
      isWL = true;
    } else if (!top) {
      // 高层下面的地板
      mapBlockConfig.fillColor = '#414141';
    } else {
      // 高层代理时间的地板
      mapBlockConfig.fillColor = 'rgba(0, 0, 0, 0)';
      mapBlockConfig.strokeColor = null;
    }
    mapBlock.attr(mapBlockConfig);
    paper.layer('map').append(mapBlock);
    if (isWL) writeLabel();

    if (top) {
      const t = data ? task(mapBlock, { color: 'rgba(230,230,230, 0.5)', title: data.name, message: `等级${data.inst.level}${branches ? '  |  由敌人召唤，出现时间看梅菲斯特的技能' : ''}` }, heightType)
        : task(mapBlock, typeData, heightType);
      mapBlock.on('click', t);
      mapBlock.on('mouseenter', t);
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
  paper
  mapRadio
  top
  run = false
  finder = new PF.AStarFinder();
  constructor(container, radio = 100, mapData = { width: 1600, height: 900 }, preData, top = false) {
    const config = {
      viewport: ['auto', 'auto'],
      stickMode: 'width',
      resolution: [mapData.width * 100, mapData.height * 100]
    };
    this.paper = new Scene(container, config);
    this.mapRadio = radio;
    this.top = top;
    this.setDataBeta(mapData, preData);
    const sMap = this.map.map(el => el.map(el => el.crossAble > -1 && el.crossAble < 5 ? 0 : 1));
    this.grid = new PF.Grid(sMap);
  }
  async ray(body) {
    return new Promise((resolve, reject) => {
      const { path, layer, color, saveTime = 0, stop } = body;
      let time = body.time || 1000;
      if (stop) {
        const stopText = new Label(stop.time + 's');
        const height = this.grid.height - 1;
        const { col, row, reachOffset = { x: 0, y: 0 } } = stop.pos;

        const fillColor = `hsla(${color}, 75%, 50%, 0.7)`;
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
        color: `hsla(${color}, 100%, 50%, 0)`,
      }, {
        offset: 1,
        color: `hsla(${color}, 100%, 50%, 0)`,
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
          { offset: 0, color: `hsla(${color}, 100%, 50%, 0.1)` },
          { offset: q, color: `hsla(${color}, 100%, 50%, 0.7)` },
          { offset: p, color: `hsla(${color}, 100%, 35%, 1)` },
          { offset: Math.min(p + 0.06, 1), color: `hsla(${color}, 100%, 50%, 0)` },
        ];
        const linearGradients = s.attr('linearGradients');
        linearGradients.strokeColor.colors = colors;
        if (len) {
          const [newX, newY] = s.getPointAtLength(p * len);
          linearGradients.strokeColor.vector = [x, y, newX, newY];
          s.attr({ linearGradients });

        }

        if (progress < time) {
          requestAnimationFrame(auto);
        } else {
          resolve();
        }

      };

      requestAnimationFrame(auto);
    });
  }

  setDataBeta(rowData, preData) {
    const { mapData, branches } = rowData;
    const np = preData ? preData.tokenInsts : [];
    this.mapData = mapData;

    this.paper.setResolution(mapData.width * this.mapRadio, mapData.height * this.mapRadio);
    this.map = spawnMap({ ...mapData, branches }, np, this.paper, this.top);
  }
  setData(mapData, preData) {
    this.clearRoutes();
    this.paper.children.forEach(el => this.paper.removeChild(el));
    // 清完再设置
    this.setDataBeta(mapData, preData);
    const sMap = this.map.map(el => el.map(el => el.crossAble > -1 && el.crossAble < 5 ? 0 : 1));
    this.grid = new PF.Grid(sMap);
  }


  spawnPathAlpha(path) {
    // console.log(path);
    const temp = path.map((cur, index, arr) => {
      const [x, y] = cur;
      if (index === 0) return { row: y, col: x };

      const [preX, preY] = arr[index - 1];
      return { row: y - preY, col: x - preX };
    });
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

  checkObstacle(x1, y1, x2, y2) {
    if (!this.grid) throw Error('No grid !');
    const compre = (x, y) => {
      if (x > y) return [y, x];
      else return [x, y];
    };

    const checkWalkable = (x, y) => this.grid.nodes[y][x].walkable || (x === x2 && y === y2);

    const pointLen = (x1, y1, x2, y2) => abs(x1 - x2) + abs(y1 - y2);

    const [minX, maxX] = compre(x1, x2);
    const [minY, maxY] = compre(y1, y2);


    const gW = maxX - minX, gH = maxY - minY;
    const tx1 = x1 === minX ? 0 : gW,
      ty1 = y1 === minY ? 0 : gH,
      tx2 = x2 === minX ? 0 : gW,
      ty2 = y2 === minY ? 0 : gH;

    const area = this.grid.nodes.filter((el, y) => y <= maxY && y >= minY)
      .map(arr => arr.filter((el, x) => x <= maxX && x >= minX).map(el => el.walkable ? 0 : 1));

    try {
      area[ty2][tx2] = 0;
    } catch (error) {
      console.log(ty2, tx2, area);
    }

    const grid = new PF.Grid(area);

    const temxp = this.finder.findPath(tx1, ty1, tx2, ty2, grid);
    if (temxp.length === 0) {
      return [-1, -1];
    }

    const dx = abs(x1 - x2), dy = abs(y1 - y2);
    // 变成了2 * 2 以上的范围就转寻路
    if (dx === dy && dx > 1) {
      return [minX + temxp[1][0], minY + temxp[1][1]];
    }
    const dirX = dx === 1 ? false : true; // | ___

    const list = this.grid.nodes.filter((el, y) => y <= maxY && y >= minY)
      .map(arr => arr.filter((el, x) => x <= maxX && x >= minX && !el.walkable)).flat();

    if (!list.length) {
      return [x2, y2];
    }

    const res = sort(list, (a, b) => pointLen(x1, y1, a.x, a.y) < pointLen(x1, y1, b.x, b.y))[0];

    const len = pointLen(x1, y1, res.x, res.y);

    let temp = dirX ? [res.x, res.y === maxY ? minY : maxY]
      : [res.x === maxX ? minX : maxX, res.y];


    if (comparePoint(x1, y1, ...temp)) {
      return !dirX ? [x1, y1 === maxY ? y1 - 1 : y1 + 1] : [x1 === maxX ? x1 - 1 : x1 + 1, y1];
    }
    if (len === 1) {
      const point = !dirX ? [temp[0], y1] : [x1, temp[1]];
      if (checkWalkable(...point)) {
        return point;
      } else {
        throw Error('unable to walk');
      }
    }
    if (checkWalkable(...temp)) {
      return temp;
    } else {
      return [-1, -1];
    }

  }

  addRoutes(route, id, color) {
    this.runningRoutes.add(id);
    const height = this.grid.height - 1;

    const { startPosition: startPos, endPosition: endPos, checkpoints } = route;

    const finder = new PF.AStarFinder({
      // allowDiagonal: true,
      diagonalMovement: 4,
      // dontCrossCorners: true,
      weight: Math.min(abs(startPos.col - endPos.col), abs(startPos.row - endPos.row)),
      heuristic:
        function (dx, dy) {
          const { x, y } = route.spawnRandomRange;
          if (x > 0 && y > 0) {
            return Math.max(dx * x, dy * (1 + y));
          } else {
            return Math.max(dx, dy);
          }
        }
    });


    const pathPoints = checkpoints.filter(el => {
      return el.type < 4 || el.type === 6;
    });
    const path = pathPoints.map(el => ({ ...el.position, type: el.type, reachOffset: el.reachOffset }));
    const holeType = path.some(el => el.type === 6);
    // const notSingleValidCheckPoint = path.filter(el => el.type === 0).length;

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

      // 不拐弯直走逻辑1，如果是2*x则开启直走
      const isNotNeedFind = route.allowDiagonalMove && (abs(nCol - col) < 2 || abs(nRow - row) < 2);


      // 寻路一次
      let section = PF.Util.compressPath(finder.findPath(col, row, nCol, nRow, ttGrid));



      //3点压缩， dx|dy === 1 
      let dx = abs(nCol - col), dy = abs(nRow - row);
      if ((dx === 1 || dy === 1) && !holeType && isNotNeedFind) {
        let [tempCol, tempRow] = [col, row], tempSection = section.slice(1);
        section = section.slice(0, 1);

        while ((dx + dy > 1)) {
          [tempCol, tempRow] = this.checkObstacle(tempCol, tempRow, nCol, nRow);
          if (tempCol < 0 && tempRow < 0) {
            [tempCol, tempRow] = tempSection.shift();
            if (section.length > 1) {
              while (comparePoint(tempCol, tempRow, ...section[section.length - 2])) {
                [tempCol, tempRow] = tempSection.shift();
              }
            }
            section.push([tempCol, tempRow]);

          } else {
            section.push([tempCol, tempRow]);
          }
          dx = abs(nCol - tempCol);
          dy = abs(nRow - tempRow);
        }
        if (!comparePoint(nCol, nRow, ...section[section.length - 1])) {
          section.push([nCol, nRow]);
        }
      } else {

        // 4点压缩
        if (section.length > 3 && route.allowDiagonalMove && (abs(nCol - col) >= 2 || abs(nRow - row) >= 2)) {
          let [tempCol, tempRow] = section[1], tempSection = section.slice(1), sLen = section.length;
          section = section.slice(0, 1);

          // 2+ * 2+
          let dx = abs(nCol - tempCol), dy = abs(nRow - tempRow);
          if (dx >= 2 && dy >= 2) {

            while (abs(nCol - tempCol) >= 2 && abs(nRow - tempRow) >= 2) {

              if (tempSection.length) {
                // 先不推进去，在这里检查两点之间有没有方块。有就在方块处停。然后寻路到下一个点原来的点。
                section.push(tempSection[0]);
              }
              // const tttGrid = tempGrid.clone();
              [tempCol, tempRow] = tempSection.shift();
              // tempSection = PF.Util.compressPath(finder.findPath(tempCol, tempRow, nCol, nRow, tttGrid));
            }

            if (tempSection.length) {
              // if (i === 0) section.push(tempSection[0]);
              if (tempSection.length >= 3) section.push(tempSection[1]);
              section.push(tempSection.pop());
            }
            if (!comparePoint(...section[section.length - 1], nCol, nRow) && sLen > 2) section.push([nCol, nRow]);

          } else if ((dx === 1 && dy > 1) || (dx > 1 && dy === 1)) {
            // 2+ * 1
            section.push(tempSection[0]);

            while ((dx === 1 && dy > 1) || (dx > 1 && dy === 1)) {
              [tempCol, tempRow] = this.checkObstacle(tempCol, tempRow, nCol, nRow);
              if (tempCol < 0 && tempRow < 0) {
                [tempCol, tempRow] = tempSection.shift();
                section.push([tempCol, tempRow]);
              } else {
                section.push([tempCol, tempRow]);
              }
              dx = abs(nCol - tempCol);
              dy = abs(nRow - tempRow);
            }
            if (!comparePoint(nCol, nRow, ...section[section.length - 1])) {
              section.push([nCol, nRow]);
            }
          }

        }
      }

      if (section.length > 0 && reachOffset) {
        section[section.length - 1][0] += reachOffset.x;
        section[section.length - 1][1] -= reachOffset.y;
      }

      // 擦墙逻辑，如果找不到路，但是点不是隧道出口， 且下一个点有reachOffset，x,y 不等于0，就擦墙看看，在of1是可以和下一段的起点连上的。
      if (section.length === 0 && arr[index + 2].type !== 6 && reachOffset.x !== 0 && reachOffset.y !== 0) {
        section.push([col, row]);
        section.push([nCol + reachOffset.x, nRow - reachOffset.y]);
      }
      section.forEach((el, index, arr) => {

        if (index + 1 < arr.length) {
          let [x, y] = el;
          if (index === 0 && cur.reachOffset) {
            x += cur.reachOffset.x;
            y -= cur.reachOffset.y;
          }

          const next = arr[index + 1];
          const len = Math.sqrt((x - next[0]) ** 2 + (y - next[1]) ** 2);
          res.push({ path: this.spawnPathAlpha([[x, y], next]), time: len * 200 || 10 });
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
        });
    };
    loop();
  }
}

export {
  Map
};
