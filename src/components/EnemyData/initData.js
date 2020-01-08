import SomeMap from 'kkdy-somemap';

import { Notification } from 'element-ui';
import { Directions } from '@/utils/string';

let instance;

const initSomeMap = (testData, container, predata, theta = (140 / 360) * Math.PI * 2, persective = 3000) => {

  const { mapData, routes } = testData;
  const mapdata = Object.assign({}, mapData);

  let noti, notiTime;
  const notiStayTime = 3000;
  const hitCubes = new Set();


  if (predata && predata.tokenInsts) predata.tokenInsts.forEach(e => {
    const tIndex = e.position.col + e.position.row * mapData.width;
    const target = mapData.tiles[tIndex];
    target.extra = {
      name: e.name + Directions[e.direction],
      description: e.description || '详见地图预设面板',
      color: [123, 213, 111, 0.3],
    };
  });

  mapdata.tiles.forEach((e) => {
    e.events = {
      click: [
        (cube) => {
          notiTime = +new Date();
          hitCubes.forEach(e => e.restore());
          hitCubes.clear();
          hitCubes.add(cube);

          if (!noti || noti.closed) {
            noti = Notification({
              title: cube.tileInfo.name,
              message: `${cube.tileInfo.description}`,
              duration: 0,
              onClose: () => {
                hitCubes.forEach(cube => {
                  if (cube.backUpAttr.state.changed) {
                    console.log('back');
                    cube.restore();
                  } else {
                    console.log('has back');
                  }
                });
                cube.update();
              }
            });
          } else {
            noti.closed = false;
            noti.message = `${cube.tileInfo.description}`;
            noti.title = cube.tileInfo.name;
          }
          setTimeout(() => {
            if (+ new Date - notiTime > notiStayTime) {
              noti.close();
            }
          }, notiStayTime);

        }
      ]
    };

  });

  // todo merge predata
  console.log(theta, persective);
  if (!instance)
    instance = new SomeMap(
      container,
      theta,
      persective,
      mapData,
      routes
    );
  else {
    instance.looping = true;
    instance.config(container, persective, theta);
    instance.init(mapData, routes);
    instance.loop();
  }

  return instance;
};

export {
  initSomeMap
};
