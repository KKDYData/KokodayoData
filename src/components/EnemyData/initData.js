import SomeMap from '@/utils/SomeMap';

import { Notification } from 'element-ui';

let instance;

const initSomeMap = (testData, container) => {

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

  console.log(container);

  if (!instance)
    instance = new SomeMap(
      container,
      (160 / 360) * Math.PI * 2,
      3500,
      mapData,
      routes
    );
  else {

    instance.init(mapData, routes);
    instance.draw(true);
  }

  return instance;
};

export {
  initSomeMap
};
