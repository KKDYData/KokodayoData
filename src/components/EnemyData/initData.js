import SomeMap from 'kkdy-somemap';

import { Notification } from 'element-ui';

let instance;

const initSomeMap = (testData, container, predata, theta = (140 / 360) * Math.PI * 2, persective = 3000) => {

  const { mapData, routes } = testData;
  const mapdata = Object.assign({}, mapData);

  let noti, notiTime;
  const notiStayTime = 3000;
  const hitCubes = [];

  mapdata.tiles.forEach((e) => {
    e.events = {
      click: [
        (cube) => {
          notiTime = +new Date();
          hitCubes.push(cube);
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
    instance.config(container, 3500, (160 / 360) * Math.PI * 2);
    instance.init(mapData, routes);
    instance.loop();
  }

  return instance;
};

export {
  initSomeMap
};
