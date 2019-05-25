class Rect {
  constructor(canvas_, data, unchange = false, c = '#aafbb375') {
    this.canvas = canvas_;
    this.name = data.name;
    this.id = data.id;
    this.x = data.x || 50;
    this.y = data.y || 50;
    this.width = data.width || 150;
    this.height = data.height || 150;
    this.color = c;
    this.lastTouchY = 0;
    this.unChange = unchange;
    // this.baseX = data.x
    // this.baseY = data.y
    // this.baseWidth = data.w
    // this.baseHeight = data.h
  }


  draw() {
    const ctx = this.canvas.ctx,
      r = this.canvas.width / 1280;
    ctx.font = '24px serif';
    ctx.fillStyle = 'white';
    ctx.fillText(this.name, (this.x + 10) * r, (this.y + 30) * r);
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x * r, this.y * r,
      this.width * r, this.height * r);
  }
  toString() {
    return { name: this.name, id: this.id, x: this.x, y: this.y, width: this.width, height: this.height };
  }
}
class Canvas {
  constructor(can, bg = null) {
    this.self = can;
    this.ctx = can.getContext('2d');
    this.width = can.width;
    this.height = can.height;
    this.background = bg;
    this.content = [];
    this.clickDown = false;
    this.ongoingTouches = [];
    this.offsetTop = 0;
    this.offsetLeft = 0;


    can.addEventListener('mousedown', this.mouseDown.bind(this));
    can.addEventListener('mousemove', this.mouseMove.bind(this));
    can.addEventListener('mouseup', this.mouseUp.bind(this));

    can.addEventListener('touchstart', this.handleStart.bind(this), { passive: true });
    can.addEventListener('touchmove', this.handleMove.bind(this), { passive: true });
    can.addEventListener('touchend', this.mouseUp.bind(this));
    can.addEventListener('touchcancel', this.handleCancel.bind(this));
  }

  handleStart(evt) {
    evt.preventDefault();
    console.log('触摸开始。');
    const touches = evt.touches,
      r = this.width / 1280;

    console.log(evt);
    let x, y;
    for (var i = 0; i < touches.length; i++) {
      x = (touches[i].pageX - this.offsetLeft) / r, y = (touches[i].pageY - this.offsetTop) / r;
      this.ongoingTouches.push(touches[i]);
      console.log('第 ' + i + ' 个触摸已开始。');
      console.log('x: ' + x + ' y: ' + y);
      this.comfirmArea(x, y, evt);
    }
  }
  handleMove(evt) {
    evt.preventDefault();
    console.log(this.offsetLeft + ' x | y ' + this.offsetTop);
    const touches = evt.touches,
      r = this.width / 1280;
    let x, y, idx;
    for (var i = 0; i < touches.length; i++) {
      idx = this.ongoingTouchIndexById(touches[i].identifier);
      x = (touches[i].pageX - this.offsetLeft) / r, y = (touches[i].pageY - this.offsetTop) / r;
      console.log(touches[i]);

      if (idx >= 0) {
        console.log('继续第 ' + idx + '个触摸。   ' + r);
        console.log('x  ' + x + '   | y  ' + y);
        this.ongoingTouches.splice(idx, 1, copyTouch(touches[i])); // 切换触摸信息
        console.log('.');

        if (this.mouseState === 'moveScreen') {
          this.moveScreen(touches[i].screenY);
          return;
        }
        this.rectMove(x, y);
      } else {
        console.log('无法确定下一个触摸点。');
      }
    }
    function copyTouch(touch) {
      return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
    }
  }
  handleEnd(evt) {
    evt.preventDefault();
    console.log('触摸结束。');

    let idx;
    for (var i = 0; i < touches.length; i++) {
      idx = this.ongoingTouchIndexById(touches[i].identifier);

      if (idx >= 0) {

        this.ongoingTouches.splice(idx, 1); // 用完后移除
      } else {
        log('无法确定要结束哪个触摸点。');
      }
    }
    this.mouseUp();
  }
  handleCancel(evt) {
    evt.preventDefault();
    console.log('触摸取消。');
    let touches = evt.touches;

    for (var i = 0; i < touches.length; i++) {
      var idx = this.ongoingTouchIndexById(touches[i].identifier);
      this.ongoingTouches.splice(idx, 1); // 用完后移除
    }
    this.mouseUp();

  }
  ongoingTouchIndexById(idToFind) {
    for (var i = 0; i < this.ongoingTouches.length; i++) {
      var id = this.ongoingTouches[i].identifier;

      if (id == idToFind) {
        return i;
      }
    }
    return -1;    // 未找到
  }
  mouseDown(e) {
    console.log(e.offsetX + '  x || y ' + e.offsetY);
    e.preventDefault();
    e.stopPropagation();
    const r = this.width / 1280,
      x = e.offsetX / r, y = e.offsetY / r;
    // console.log('x: ' + x + ' y: ' + y)
    this.comfirmArea(x, y, e);

  }
  comfirmArea(x, y, e) {
    const arr = this.content;

    for (let i in arr) {
      const temp = arr[i],
        ttt = x > temp.x && x < temp.x + temp.width && y > temp.y && y < temp.y + temp.height;
      if (ttt) {

        this.offsetX = Math.abs(x - temp.x);
        this.offsetY = Math.abs(y - temp.y);
        this.tempChose = temp;
        console.log('offsetY: ' + e.offsetY);

        //改变框的大小
        if (this.offsetX < 15) {
          this.mouseState = 'leftChange';
          break;
        }
        if (Math.abs(this.offsetX - temp.width) < 15) {
          this.mouseState = 'rightChange';
          e.target.style.cursor = 'col-resize';

          break;
        }
        if (this.offsetY < 15) {
          this.mouseState = 'topChange';
          e.target.style.cursor = 'row-resize';

          break;
        }
        if (Math.abs(this.offsetY - temp.height) < 15) {
          this.mouseState = 'buttomChange';
          e.target.style.cursor = 'row-resize';
          break;
        }
        //移动框
        this.mouseState = 'drag';
        break;
      }
    }
    console.log(this.mouseState);
  }
  mouseUp(e) {
    this.mouseState = false;
    e.target.style.cursor = 'default';

  }
  mouseMove(e) {
    // console.log(e)
    e.stopPropagation();
    e.preventDefault();
    const
      r = this.width / 1280,
      x = e.offsetX / r, y = e.offsetY / r;

    this.rectMove(x, y);

  }
  moveScreen(y) {
    console.log(y + '   ' + this.lastTouchY);
    const offsetY = y - this.lastTouchY,
      screenY = window.pageYOffsetY || document.documentElement.scrollTop;
    console.log(screenY);
    console.log(offsetY);
    this.lastTouchY = y;
    window.pageYOffset = document.documentElement.scrollTop = screenY - offsetY;
  }
  rectMove(x, y) {
    const self = this,
      obj = self.tempChose;
    if (!this.mouseState) return;
    // console.log('x  ' + x + '   y   ' + y)
    const temp = this.mouseState;
    let w, h;
    console.log(temp);
    if (temp === 'drag') {
      self.tempChose.x = x - self.offsetX;
      self.tempChose.y = y - self.offsetY;
    } else if (!obj.unChange)
      switch (temp) {
      case 'buttomChange':
        h = y - obj.y;
        console.log('setH: ' + h + ' obj.y: ' + obj.y + ' obj.w' + obj.width);
        obj.height = h > 30 ? h : 30;
        break;
      case 'topChange':
        h = obj.height + (obj.y - y);
        obj.height = h > 30 ? h : 30;
        obj.y = y;
        break;
      case 'rightChange':
        w = x - obj.x;
        obj.width = w > 30 ? w : 30;
        break;
      case 'leftChange':
        w = obj.width + (obj.x - x);
        obj.width = w > 30 ? w : 30;
        obj.x = x;
        break;
      default:
        console.log('state' + this.mouseState + '?????');
      }
    requestAnimationFrame(self.draw.bind(self));

  }

  //绘图api
  set Left(x) {
    this.offsetLeft = x + this.self.offsetLeft;
  }
  set Top(x) {
    this.offsetTop = x + this.self.offsetTop;
  }
  clear() {
    const canvas = this;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  addBg(img) {
    this.background = img;
    // this.height = img.height * this.width / img.width
    // console.log(this.height)
  }
  drawBg(bg) {
    const background = bg || this.background;
    if (!this.background) return;
    const r = this.background.height / this.background.width;
    this.ctx.drawImage(background, 0, 0, this.width, this.width * r);

  }

  addItem(obj) {
    this.content.push(obj);
  }
  draw() {
    this.clear();
    this.drawBg();
    for (let i in this.content) {
      this.content[i].draw();
    }
  }

  resize(w, h) {
    w && (this.width = w);
    h && (this.height = h);
  }

  clearContent() {
    this.content = [];
  }

}
const throttle = function (action, delay) {
  var last = 0;
  return function () {
    var curr = +new Date();
    if (curr - last > delay) {
      action.apply(this, arguments);
      last = curr;
    }
  };
};

const rectDataContent = [
  { id: 'Scan-name', 'x': 23, 'y': 70, 'width': 338, 'height': 165 },
  { id: 'Scan-heroBackground', 'x': 912, 'y': 139, 'width': 354, 'height': 204 },
  { id: 'Scan-mission-1', 'x': 917, 'y': 380, 'width': 355, 'height': 143 },
  { id: 'Scan-mission-2', 'x': 1193, 'y': 558, 'width': 75, 'height': 144 },
  { id: 'Pic-skill1', 'x': 32, 'y': 305, 'width': 73, 'height': 73 },
  { id: 'Pic-skill2', 'x': 110, 'y': 306, 'width': 73, 'height': 73 },
  { id: 'Pic-skill3', 'x': 186, 'y': 305, 'width': 73, 'height': 73 },
  { id: 'Pic-profile', 'x': 543, 'y': 79, 'width': 132, 'height': 124 },

];
const rectDataStats = [
  { id: 'statsRect', 'x': 42, 'y': 367, 'width': 248, 'height': 258 }

];

// const rectData = new Map
// const changeToMap(){

// }

export { Rect, Canvas, rectDataContent };

