import { Scene, Sprite, Path, Label } from 'spritejs';

const spwanColor = () => {
  return [127 + 128 * Math.random(), 255 * Math.random(), 128 * Math.random()].map(Math.round);
};

async function ray(path, paper) {
  const pos = [0, 0];
  return new Promise((res) => {
    // console.log(path);
    const route = new Path();
    const s = new Path();
    const sPath = {
      d: path, //'m 50 450 h 100 h 500 v 200 h 500',//l 0 0 l 450 650 l 250 650
      lineCap: 'round',
      lineJoin: 'round',
      transform: {
        // scale: [1, -1]
      }
    };


    const color = spwanColor();
    const rFullColors = 'rgba(0, 0, 0, 0.2)';
    const fullColors = [{
      offset: 0,
      color: `rgba(${color[0]},${color[1]},${color[2]},0)`,
    }, {
      offset: 1,
      color: `rgba(${color[0]},${color[1]},${color[2]},0)`,
    }];

    route.attr({
      pos,
      path: sPath,
      lineWidth: 6,
      color: rFullColors
    });

    paper.layer('bg').append(route);

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

    paper.layer().append(s);

    let i = 0;
    const len = s.getPathLength();
    let [x, y] = path.split(' ').slice(1, 3);
    const time = 15;
    const auto = () => {
      if (i > 100) throw Error('101???');
      let q = 0;
      let p = i / time;
      if (p > 0.618) {
        q = 1 - (1 - p) / 0.382;
      }

      p = Math.min(p / 0.7, 1);

      const colors = [
        { offset: 0, color: `rgba(${color[0]},${color[1]},${color[2]},0)` },
        { offset: q, color: `rgba(${color[0]},${color[1]},${color[2]},0)` },
        { offset: p, color: `rgba(${color[0]},${color[1]},${color[2]},1)` },
        { offset: Math.min(p + 0.06, 1), color: `rgba(${color[0]},${color[1]},${color[2]},0)` },
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
          // stop();
          // paper.layer('bg').remove(route);
          paper.layer().remove(s);
          clearInterval(stop);
          res();
        }
      }, 17);
    }
    requestAnimationFrame(loadAnimate);
  });
}


// const flayPath = (container, data) => {
//   const rowData = data.filter(el => el);

//   const spwanPath = route => {
//     const radio = 125;
//     const cen = radio / 2;

//     const { startPosition: startPos, endPosition: endPos, checkpoints } = route;
//     const path = checkpoints.filter(el => el.type === 0).map(el => el.position);
//     path.unshift(startPos);
//     path.push(endPos);
//     console.log(path);
//     const temp = path.map((cur, index, arr) => {
//       if (index === 0) return cur;
//       const pre = arr[index - 1];
//       return { row: cur.row - pre.row, col: cur.col - pre.col };
//     });
//     console.log(temp);
//     return temp.reduce((path, { row, col }, index) => {
//       if (index === 0) return `m ${col * radio + cen} ${row * radio + cen}`;
//       if (row === 0) return `${path} h ${col * radio} `;
//       if (col === 0) return `${path} v ${row * radio} `;
//       return `${path} l ${col * radio} ${row * radio}`;
//     }, '');
//   };


//   const paper = new Scene(container, {
//     viewport: ['auto', 'auto'],
//     resolution: [1600, 900],
//     stickMode: 'width',
//   });



//   async function ray(path) {
//     const pos = [0, 0];
//     return new Promise((res) => {
//       // console.log(path);
//       const route = new Path();
//       const s = new Path();
//       const sPath = {
//         d: path, //'m 50 450 h 100 h 500 v 200 h 500',//l 0 0 l 450 650 l 250 650
//         lineCap: 'round',
//         lineJoin: 'round',
//         transform: {
//           // scale: [1, -1]
//         }
//       };


//       const color = spwanColor();
//       const rFullColors = 'rgba(0, 0, 0, 0.2)';
//       const fullColors = [{
//         offset: 0,
//         color: `rgba(${color[0]},${color[1]},${color[2]},0)`,
//       }, {
//         offset: 1,
//         color: `rgba(${color[0]},${color[1]},${color[2]},0)`,
//       }];

//       route.attr({
//         pos,
//         path: sPath,
//         lineWidth: 6,
//         color: rFullColors
//       });

//       paper.layer('bg').append(route);

//       s.attr({
//         pos,
//         lineWidth: 6,
//         path: sPath,
//         linearGradients: {
//           strokeColor: {
//             vector: [10, 30, 180, 90],
//             colors: fullColors,
//           },
//         },
//       });

//       paper.layer().append(s);

//       let i = 0;
//       const len = s.getPathLength();
//       let [x, y] = path.split(' ').slice(1, 3);

//       const auto = () => {
//         if (i > 100) throw Error('101???');
//         let q = 0;
//         let p = i / 100;
//         if (p > 0.618) {
//           q = 1 - (1 - p) / 0.382;
//         }

//         p = Math.min(p / 0.7, 1);

//         const colors = [
//           { offset: 0, color: `rgba(${color[0]},${color[1]},${color[2]},0)` },
//           { offset: q, color: `rgba(${color[0]},${color[1]},${color[2]},0)` },
//           { offset: p, color: `rgba(${color[0]},${color[1]},${color[2]},1)` },
//           { offset: Math.min(p + 0.06, 1), color: `rgba(${color[0]},${color[1]},${color[2]},0)` },
//         ];

//         const linearGradients = s.attr('linearGradients');
//         linearGradients.strokeColor.colors = colors;
//         const [newX, newY] = s.getPointAtLength(p * len);
//         linearGradients.strokeColor.vector = [x, y, newX, newY];

//         s.attr({ linearGradients });
//       };

//       function loadAnimate() {
//         const stop = setInterval(() => {
//           if (i++ < 99) {
//             requestAnimationFrame(auto);
//           } else {
//             // stop();
//             paper.layer('bg').remove(route);
//             paper.layer().remove(s);
//             clearInterval(stop);
//             res();
//           }
//         }, 17);
//       }
//       requestAnimationFrame(loadAnimate);
//     });
//   }
//   // ray()

//   let index = 0;
//   const loop = () => {
//     console.log(index);
//     // while (index < rowData.length) {
//     //   ray(spwanPath(rowData[index++]));
//     // }
//     if (index > rowData.length) return;
//     return ray(spwanPath(rowData[index++]), paper).then(() => {
//       loop();
//     });
//   };
//   loop();
// };

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
  const temp = path.map((cur) => {
    return { row: map.length - 1 - cur.row, col: cur.col };

  });//.map(({ row, col }) => ({ row: row, col }));
  console.log(temp, route);
  // const { row, col } = temp[0];
  let i = 0;
  return temp.reduce((path, cur, index) => {
    if (index === 0) {
      const { row, col } = cur;
      path.push(map[row][col]);
      return path;
    }
    let deep = 0;
    const findWay = (target, lastPath, deep) => {
      console.log(lastPath);
      let [x, y] = lastPath[lastPath.length - 1].rc; //现在的位置
      const lastPos = lastPath.length > 1 ? lastPath[lastPath.length - 2] : lastPath[0];//上一个位置
      const { left, right, up, down } = getAround(x, y, map);
      const dirs = [{ dir: 'left', data: left }, { dir: 'right', data: right }, { dir: 'up', data: up }, { dir: 'down', data: down }]
        .filter(el => {

          const firstTemp = el.data && (el.data.i !== lastPos.i) && (el.data.crossAble > -1);
          if (firstTemp) {
            const [x, y] = el.data.rc;
            if (el.data.crossAble === 4 && (x !== target.col && y !== target.row)) return false;
            if (el.data.crossAble === 5 && x !== target.col && y !== target.row) return false;
            // else if (lastPath.find(pos => pos.i === el.data.i)) return false;
            else return true;
          }
        });

      console.log('step:__________', deep, i++, target, 'dirs:', dirs);
      console.log('loop', lastPath[lastPath.length - 1], lastPath);
      if (i > 300 || lastPath.length > 30) {
        console.log(temp, deep, lastPath);
        throw Error('boom!');
      }
      if (dirs.length === 1) {
        const temp = dirs[0].data;
        [x, y] = temp.rc;
        if (x === target.col && y === target.row) {
          lastPath.push(temp);
          console.log('Right way !_________________________________________!!!!', temp, target, lastPath);
          return lastPath;
        }
        if (temp.crossAble === 0) {
          if (x === target.col && y === target.row) {
            lastPath.push(temp);
            console.log('Right way !_________________________________________!!!!', target, lastPath);
            return lastPath;
          } else {
            console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx，死路——————————————', deep);
            if (deep === 0) {
              console.log('------------掉头xxxxxxxxxxxx');
              return findWay(target, [...lastPath, lastPos], deep);
            }
            console.log('Error way!', target, temp, deep);
            return false;
          }
        } else {
          lastPath.push(temp);
          console.log('find ! ', lastPath);
          return findWay(target, lastPath, deep);
        }
      } else if (dirs.length > 0) {

        console.log('_____________');
        const [toU, toL] = [target.row - y, x - target.col];
        const ableDir = [toU === 0 ? 'n' : toU > 0 ? 'up' : 'down', toL === 0 ? 'n' : toL > 0 ? 'left' : 'right'];
        console.log(toL, ableDir);
        const resDir = dirs.filter(el => ableDir.find(key => key === el.dir));
        console.log(resDir);
        if (resDir.length > 1) {
          console.log('分支');

          const res = resDir.filter(el => el.data.crossAble !== 4).map(el => {
            if (lastPath.find(pos => pos.i === el.data.i)) return false;
            const arr = [...lastPath, el.data];
            return findWay(target, arr, deep + 1);
          }).filter(el => el);
          if (res.length > 0) {
            return res.reduce((pre, cur) => (pre.length < cur.length ? pre : cur));
          }
          else {
            console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx，死路——————————————', deep);
            if (deep === 0) {
              console.log('------------掉头xxxxxxxxxxxx');
              return findWay(target, [...lastPath, lastPos], deep);
            }
          }
        } else if (resDir.length === 1) {
          // const [r, c] = resDir[0].data.rc;
          lastPath.push(resDir[0].data);
          [x, y] = resDir[0].data.rc;
          if (x === target.col && y === target.row) {
            console.log('Right way !_________________________________________!!!!', temp, target, lastPath);
            return lastPath;
          }
          console.log('find no branch ! ', lastPath);

          return findWay(target, lastPath, deep);
        } else {
          console.log(target, x, y, dirs, '分支');
          const res = dirs.map(el => findWay(target, [...lastPath, el.data], deep + 1)).filter(el => el);
          if (res.length > 0) {
            return res.reduce((pre, cur) => (pre.length < cur.length ? pre : cur));
          }
        }
      } else {
        console.log('____________________________Error way!____测试隧道', target, temp, lastPath, deep);
        const [x, y] = lastPath[lastPath.length - 1].rc;
        const now = map[y][x];
        console.log(now);
        if (now.tileKey === 'tile_telin') {
          console.log('bingo');
          return [...lastPath, map[target.row][target.col]];
        }

        return false;

      }
    };

    // console.log(path, cur);
    const finalPath = findWay(cur, path, deep);
    console.log(path, cur, finalPath, i, deep);

    // }

    return finalPath;
  }, []);
};


const radio = 120;
const cen = radio / 2;

const mapBlockColoc = {
  0: 'grey',
  1: '#ed8',
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
  // lineJoin: 'round',
};

const spwanMap = ({ map, tiles }, paper) => {
  const myMap = map.map((el, row) => el.map((i, col, arr) => {
    let { left, right, up, down } = getAround(col, row, map);
    const key = tiles[i].tileKey;
    const crossAble = /end/.test(key) ? 4 : /start/.test(key) ? 5 : tiles[i].passableMask === 3 ? [left, right, up, down].map(el => tiles[el]).reduce((pre, cur) => {
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
    const label = new Label(`${i} ${col} ${row}\n${tileKey}\nkey: ${tiles[i].passableMask}`);
    const labelPos = [pos[0] + cen / 2, pos[1] + cen / 2];
    label.attr({
      pos: labelPos,
      fillColor: '#707',
      border: [2.5, '#ccc'],
    });
    mapBlock.attr({
      pos,
      lineWidth: 6,
      path: mapReact,
      fillColor,
      transform: {
        // scale: [1, -1]
      }
    });

    paper.layer('map').append(mapBlock);
    paper.layer('map').append(label);
  }));
  return myMap;
};


const spwanPathApha = path => {
  const temp = path.map((cur, index, arr) => {
    const [x, y] = cur;
    if (index === 0) return { row: y, col: x };
    const [preX, preY] = arr[index - 1];
    return { row: y - preY, col: x - preX };
  });//.map(({ row, col }) => ({ row: row, col }));

  return temp.reduce((path, { row, col }, index) => {
    if (index === 0) return `m ${col * radio + cen} ${row * radio + cen}`;
    if (row === 0) return `${path} h ${col * radio} `;
    if (col === 0) return `${path} v ${row * radio} `;
    return `${path} l ${col * radio} ${row * radio}`;
  }, '');
};

const normalPath = (container, data, mapData) => {
  let index = 1;
  const paper = new Scene(container, {
    viewport: ['auto', 'auto'],
    resolution: [1600, 900],
    stickMode: 'width',
  });
  const myMap = spwanMap(mapData, paper);
  console.log(mapData);
  console.log(data.length);
  data = data.filter(el => el.motionMode !== 1);
  const loopBeta = () => {
    // while (index < rowData.length) {
    //   ray(spwanPath(rowData[index++]));
    // }
    if (index < data.length) {
      let path = data[index++];
      console.log(index, path);
      const beta = spwanPathBeta(path, myMap);
      console.log(beta);
      const pppp = beta.map(el => el.rc);
      console.log(pppp);
      const test = spwanPathApha(pppp);
      console.log(test);
      // const pppPath = spwanPathApha(route);
      return ray(test, paper).then(() => {
        console.log(index);
        loopBeta();
      });
    }
  };
  loopBeta();
};

export {
  normalPath,
  // flayPath
};
