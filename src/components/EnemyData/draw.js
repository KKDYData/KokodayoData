import { Scene, Path, Label } from 'spritejs';

async function ray(path, single, color = 360 * Math.random()) {
  const pos = [0, 0];
  return new Promise((resolve, reject) => {
    const s = new Path();
    const sPath = {
      d: path,
      lineCap: 'round',
      lineJoin: 'round',
    };

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
      path: sPath,
      linearGradients: {
        strokeColor: {
          vector: [10, 30, 180, 90],
          colors: fullColors,
        },
      },
    });

    single.append(s);

    let i = 0;
    const len = s.getPathLength();
    let [x, y] = path.split(' ').slice(1, 3);
    const time = 70;
    const auto = () => {
      let q = 0;
      let p = i / time;
      if (p > 0.618) {
        q = 1 - (1 - p) / 0.382;
      }
      p = Math.min(p / 0.7, 1);

      const colors = [
        { offset: 0, color: `hsla(${color}, 100%, 50%, 0)` },
        { offset: q, color: `hsla(${color}, 100%, 50%, 0)` },
        { offset: p, color: `hsla(${color}, 100%, 50%, 1)` },
        { offset: Math.min(p + 0.06, 1), color: `hsla(${color}, 100%, 50%, 0)` },
      ];

      const linearGradients = s.attr('linearGradients');
      linearGradients.strokeColor.colors = colors;
      const [newX, newY] = s.getPointAtLength(p * len);
      linearGradients.strokeColor.vector = [x, y, newX, newY];

      s.attr({ linearGradients });
    };

    function loadAnimate() {

      const stop = setInterval(() => {
        if (i++ < time - 1) {
          requestAnimationFrame(auto);
        } else {
          single.remove();
          clearInterval(stop);
          resolve();
        }
      }, 17);
    }
    requestAnimationFrame(loadAnimate);
  });
}



const getAround = (row, col, map) => {
  const arr = map[col];
  let left, right, up, down;
  if (row - 1 > -1) left = map[col][row - 1];
  if (row + 1 < arr.length) right = map[col][row + 1];
  if (col + 1 < map.length) up = map[col + 1][row];
  if (col - 1 > -1) down = map[col - 1][row];
  return { left, right, up, down };
};

const spwanPathBeta = (route, map) => {
  const { startPosition: startPos, endPosition: endPos, checkpoints } = route;
  const path = checkpoints.filter(el => el.type === 0).map(el => el.position);

  if (path.length === 0 || startPos.row !== path[0].row || startPos.col !== path[0].col) path.unshift(startPos);
  if (path.length === 0 || endPos.row !== path[path.length - 1].row || endPos.col !== path[path.length - 1].col) path.push(endPos);
  // 垂直翻转
  const temp = path.map((cur) => {
    return { row: map.length - 1 - cur.row, col: cur.col };
  });
  //motionMode 1 的似乎是飞机路线
  if (route.motionMode === 1) {
    return temp.map(el => ({ rc: [el.col, el.row] }));
  }
  console.log('route', temp);
  let i = 0;
  return temp.reduce((path, cur, index) => {
    if (index === 0) {
      const { row, col } = cur;
      path.push(map[row][col]);
      return path;
    }
    let deep = 0;
    const findWay = (target, lastPath, deep) => {
      ////console.log(lastPath);
      let [x, y] = lastPath[lastPath.length - 1].rc; //现在的位置
      const lastPos = lastPath.length > 1 ? lastPath[lastPath.length - 2] : lastPath[0];//上一个位置
      const { left, right, up, down } = getAround(x, y, map);
      const dirs = [{ dir: 'left', data: left }, { dir: 'right', data: right }, { dir: 'up', data: up }, { dir: 'down', data: down }]
        .filter(el => {
          const firstTemp = el.data && (el.data.i !== lastPos.i) && (el.data.crossAble > -1);
          if (firstTemp) {
            const [x, y] = el.data.rc;
            if (el.data.crossAble === 4 && (x !== target.col || y !== target.row)) return false;
            if (el.data.crossAble === 5 && (x !== target.col || y !== target.row)) return false;
            else if (lastPath.slice(lastPath.length - 5).find(pos => pos.i === el.data.i)) return false;
            if (el.data.crossAble === 5) {
              throw Error('error');
            }
            else return true;
          }
        });

      // console.log('step:__________', deep, i++, target, 'dirs:', dirs);
      //console.log('loop', lastPath[lastPath.length - 1], lastPath);
      if (i > 300 || lastPath.length > 60) {
        console.log(temp, deep, lastPath);
        lastPath.forEach(el => console.log(el.i, el.rc));
        throw Error('boom!');
      }
      if (dirs.length === 1) {
        const temp = dirs[0].data;
        [x, y] = temp.rc;
        if (x === target.col && y === target.row) {
          lastPath.push(temp);
          //console.log('Right way !_________________________________________!!!!', temp, target, lastPath);
          return lastPath;
        }
        if (temp.crossAble === 0) {
          if (x === target.col && y === target.row) {
            lastPath.push(temp);
            //console.log('Right way !_________________________________________!!!!', target, lastPath);
            return lastPath;
          } else {
            //console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx，死路——————————————', deep);
            if (deep === 0) {
              //console.log('------------掉头xxxxxxxxxxxx');
              return findWay(target, [...lastPath, lastPos], deep);
            }
            //console.log('Error way!', target, temp, deep);
            if (deep > 0) return false;
            else throw Error('Deep error!');
          }
        } else {
          lastPath.push(temp);
          //console.log('find ! ', lastPath);
          return findWay(target, lastPath, deep);
        }
      } else if (dirs.length > 0) {

        //console.log('_____________');
        const [toU, toL] = [target.row - y, x - target.col];
        const ableDir = [toU === 0 ? 'n' : toU > 0 ? 'up' : 'down', toL === 0 ? 'n' : toL > 0 ? 'left' : 'right'];
        //console.log(toL, ableDir);
        const resDir = dirs.filter(el => ableDir.find(key => key === el.dir));
        //console.log(resDir);
        if (resDir.length > 1) {
          //console.log('分支');
          const res = resDir.filter(el => el.data.crossAble !== 4).map(el => {
            if (lastPath.find(pos => pos.i === el.data.i)) return false;
            const arr = [...lastPath, el.data];
            return findWay(target, arr, deep + 1);
          }).filter(el => el);

          if (res.length > 0) {
            return res.reduce((pre, cur) => (pre.length < cur.length ? pre : cur));
          }
          else {
            //console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx，死路——————————————', deep);
            if (deep === 0) {
              //console.log('------------掉头xxxxxxxxxxxx');
              return findWay(target, [...lastPath, lastPos], deep);
            }
          }
        } else if (resDir.length === 1) {
          // const [r, c] = resDir[0].data.rc;
          lastPath.push(resDir[0].data);
          [x, y] = resDir[0].data.rc;
          if (x === target.col && y === target.row) {
            //console.log('Right way !_________________________________________!!!!', temp, target, lastPath);
            return lastPath;
          }
          //console.log('find no branch ! ', lastPath);

          return findWay(target, lastPath, deep);
        } else {
          //console.log(target, x, y, dirs, '分支');
          const res = dirs.map(el => findWay(target, [...lastPath, el.data], deep + 1)).filter(el => el);
          if (res.length > 0) {
            return res.reduce((pre, cur) => (pre.length < cur.length ? pre : cur));
          }
        }
      } else {
        //console.log('____________________________Error way!____测试隧道', target, temp, lastPath, deep);
        const [x, y] = lastPath[lastPath.length - 1].rc;
        const now = map[y][x];
        //console.log(now);
        if (now.tileKey === 'tile_telin') {
          //console.log('bingo');
          const teioutAround = Object.values(getAround(target.col, target.row, map)).filter(el => el.tileKey === 'tile_telout')[0];
          console.log('隧道出口口', teioutAround, map[target.row][target.col]);
          return teioutAround ? [...lastPath, now, teioutAround, map[target.row][target.col]]
            : [...lastPath, now, map[target.row][target.col]];
        }
        if (deep > 0) return false;
        else throw Error('Deep error!');

      }
    };
    return findWay(cur, path, deep);
  }, []);
};


const radio = 100;
const cen = radio / 2;

const mapBlockColoc = {
  0: 'grey',
  // 1: '#ed8',
  // 2: '#fff',
  1: '#fff',
  2: '#fff',
  3: '#fff',
  4: 'green',
  5: 'red'
};

const react = `m 0 0 h ${radio} v ${radio} h ${-radio} z`;
console.log(react);
const mapReact = {
  d: react,
  lineCap: 'round',
};

const spwanMap = ({ map, tiles }, paper) => {
  const myMap = map.map((el, row) => el.map((i, col, arr) => {
    let { left, right, up, down } = getAround(col, row, map);
    const key = tiles[i].tileKey;
    const crossAble = /end/.test(key) ? 4 : /start/.test(key)
      ? 5 : tiles[i].passableMask === 3 ? [left, right, up, down].map(el => tiles[el]).reduce((pre, cur) => {
        if (cur && cur.passableMask === 3) return ++pre;
        else return pre;
      }, -1) : -1;
    // console.log(i, tiles[i].tileKey, crossAble);

    const rc = [col, row];
    return {
      i,
      rc,
      crossAble,
      tileKey: tiles[i].tileKey
    };
  }));
  myMap.forEach((el) => el.forEach(({ rc, crossAble, i, tileKey }) => {
    const [col, row] = rc;
    const pos = [col * radio, row * radio];
    const fillColor = mapBlockColoc[crossAble];
    const mapBlock = new Path();
    const label = new Label(`${i} ${col} ${row}\n${tileKey}\nkey: ${map[row][col].passableMask}`);
    const labelPos = [pos[0] + cen / 2, pos[1] + cen / 2];
    label.attr({
      pos: labelPos,
      fillColor: '#707',
    });
    mapBlock.attr({
      pos,
      lineWidth: 1,
      path: mapReact,
      fillColor,
    });

    paper.layer('map').append(mapBlock);
    if (process.env.NODE_ENV === 'development')
      paper.layer('map').append(label);
  }));
  return myMap;
};






class Map {
  constructor(container, radio = 100, mapData = { width: 1600, height: 900 }, routes) {
    const config = {
      viewport: ['auto', 'auto'],
      stickMode: 'width',
      resolution: [mapData.width * 100, mapData.height * 100]
    };
    this.paper = new Scene(container, config);
    this.radio = radio;
    this.runningRoutes = new Set();
    this.tempRoutes = {};
    this.run = false;
    // 稍微做个判定，给以后用
    if (routes) {
      this.mapData = mapData;
      this.map = spwanMap(mapData, this.paper);
      this.routes = routes;
    }
  }
  setData(mapData, routes) {
    this.routes = routes;
    this.paper.children.forEach(el => {
      this.paper.removeChild(el);
    });
    this.clearRoutes();
    this.paper.setResolution(mapData.width * this.radio, mapData.height * this.radio);
    this.mapData = mapData;
    this.map = spwanMap(mapData, this.paper);
  }

  loadMap() {
    this.map = spwanMap(this.mapData, this.paper);
  }

  checkCrossAble(arr) {
    if (arr.length < 3) return false;
    console.log('checkCrossAble', arr);
    const [a, center, b] = arr;
    let row, col;
    if (a[0] === center[0]) {
      row = a[1];
      col = b[0];
    } else {
      col = a[0];
      row = b[1];
    }
    // const row = arr[2][1], col = arr[0][0];
    // const row = arr.f
    const target = this.map[row][col].crossAble;
    console.log('target', col, row);
    return target > -1 && target < 4;
    // return this.map[row][col].crossAble > -1;
  }
  spwanPathAlpha(path, diagonal) {
    console.log(path);
    let temp = path.map((cur, index, arr) => {
      const [x, y] = cur;
      if (index === 0) return { row: y, col: x };
      const [preX, preY] = arr[index - 1];
      return { row: y - preY, col: x - preX };
    });//.map(({ row, col }) => ({ row: row, col }));
    console.log(temp);
    if (diagonal) {
      let offset = 0;
      temp = temp.reduce((res, cur, index, arr) => {
        if (index + 1 < arr.length) {
          console.log(arr[index + 1]);
          const { row: nextRow, col: nextCol } = arr[index + 1],
            { row, col } = cur;
          if ((nextRow === col || row === nextCol) && this.checkCrossAble(path.slice(index + offset - 1, index + offset + 2))) {
            if (col === 0) {
              res.push({ row: row, col: nextCol });
            } else {
              res.push({ row: nextRow, col: col });
            }
            arr.splice(index + 1, 1);
            offset++;
          } else {
            res.push(cur);
          }
        } else {
          res.push(cur);
        }
        console.log(res);
        return res;
      }, []);
    }
    // let new
    return temp.reduce((path, { row, col }, index) => {
      if (index === 0) return `m ${col * radio + cen} ${row * radio + cen}`;
      if (row === 0) return `${path} h ${col * radio} `;
      if (col === 0) return `${path} v ${row * radio} `;
      return `${path} l ${col * radio} ${row * radio}`;
    }, '');
  }

  deleteRoute(x) {
    this.runningRoutes.delete(x);
    delete this.tempRoutes[x];
  }
  addRoutes(x, color) {
    //可以接受Array或者Number
    if (Array.isArray(x)) {
      x.forEach(this.runningRoutes.add);
    } else if (Number.isInteger(x)) {
      this.runningRoutes.add(x);
      const route = this.routes.find((el, index) => x === index);
      this.tempRoutes[x] = ({
        route: this.spwanPathAlpha(spwanPathBeta(route, this.map).map(el => el.rc), route.allowDiagonalMove),
        index: x,
        color
      });
    } else {
      throw Error('Just receive Array or Number');
    }

    // this.tempRoutes = this.routes.reduce((res, route, index) => {
    //   if (this.runningRoutes.has(index)) {
    //     console.log(route);
    //     res[index] = ({
    //       route: this.spwanPathAlpha(spwanPathBeta(route, this.map).map(el => el.rc), route.allowDiagonalMove),
    //       index,
    //       color
    //     });
    //   }
    //   return res;
    // }, {});

    if (!this.run) {
      this.run = true;
      this.loopRoutes();
    }
  }
  clearRoutes() {
    this.run = false;
    this.runningRoutes.clear();
  }
  loopRoutes() {
    console.log(this.tempRoutes);
    const loop = () => {
      Promise.all(Object.values(this.tempRoutes).map(el => {
        console.log(el.color);
        return el.route ? ray(el.route, this.paper.layer(el.index), el.color) : Promise.reject();
      }))
        .then(() => {
          if (Object.values(this.tempRoutes).length === 0) this.run = false;
          if (this.run) loop();
        });
    };
    loop();
  }
}

export {
  Map
};
