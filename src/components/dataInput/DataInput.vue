<template>
  <div class="datainput-container">
    <el-row>
      <el-col>
        <dataTable
          ref="dataTable"
          v-on:changeName="changeHeroName"
          v-on:uploadData="uploadData"
          v-on:checkSoulBurn="checkSoulBurn"
        >
          <!-- <template v-slot:profile></template> -->
          <template v-slot:skill-0>
            <div id="skill-0" width="100%"></div>
          </template>
          <template v-slot:skill-1>
            <div id="skill-1" width="100%"></div>
          </template>
          <template v-slot:skill-2>
            <div id="skill-2" width="100%"></div>
          </template>
        </dataTable>
      </el-col>
    </el-row>
    <!-- 加载提示条 -->
    <div class="loading-fixed" v-if="loading">
      <div class="progress-wrapper">
        <el-progress type="circle" status="text" :percentage="scanPercentage">{{laodingText}}</el-progress>
      </div>
    </div>
    <!-- 被淘汰 -->
    <showServerList
      v-on:close="listsShow = false"
      v-if="listsShow"
      v-on:insertImgs="insertServerImgs"
      v-on:editServerData="editServerData"
      ref="list"
      :data="nameList"
    />
    <div class="controlWrapper">
      <div class="controlRow" style="justify-content: center">
        <!-- 基本操作 -->
        <div v-if="settingButtonsShow">
          <!-- <el-button icon="el-icon-refresh" @click="reDraw()"></el-button> -->
          <el-button circle icon="el-icon-refresh" @click="clear()"></el-button>
          <el-button circle icon="el-icon-edit" @click="defaultClip()"></el-button>
          <el-button circle icon="el-icon-plus" @click="drawABox()"></el-button>
          <el-button circle icon="el-icon-printer" @click="saveRect()"></el-button>
          <el-button circle icon="el-icon-error" @click="controlR = !controlR"></el-button>
        </div>
        <div v-else>
          <el-button round class="file">
            选择图片
            <input type="file" id="uploadPic">
          </el-button>
          <el-button circle :disabled="!canCheck" icon="el-icon-search" @click="recognize()"></el-button>
          <el-button circle icon="el-icon-edit" @click="cutImg"></el-button>
          <el-button circle class="el-icon-more" type="info" @click="showLists"></el-button>
        </div>
        <div style="margin-left: 20px">
          <el-button
            circle
            icon="el-icon-setting"
            @click="settingButtonsShow = !settingButtonsShow"
          ></el-button>
        </div>
      </div>
      <!-- 模式选择 -->
      <div class="controlRow" style="justify-content: center">
        <div style="margin-right: 20px">
          <el-button
            circle
            size="medium"
            icon="el-icon-setting"
            @click="settingModeButtonsShow = !settingModeButtonsShow"
          ></el-button>
        </div>
        <div v-if="settingModeButtonsShow">
          <el-select v-model="nowModeTempNum" style="margin-right: 20px" @change="changeMode">
            <el-option
              v-for="(item, index) in modeTemplateList"
              :key="item"
              :value="index"
              :label="item"
            ></el-option>
          </el-select>
        </div>
        <div v-else>
          <el-button
            round
            size="medium"
            v-for="(arr) in nowModeArr"
            :key="arr.name"
            :type="nowMode.name === arr.name ? 'success' : ''"
            @click="choseMode(arr.name)"
          >{{arr.name}}</el-button>
        </div>
      </div>
      <!-- 当前模式提示 -->
      <div
        class="choseMode"
        v-if="nowMode.name"
      >模式-{{modeTemplateList[nowModeTempNum]}}--正在录入-{{nowMode.name}}</div>
    </div>

    <el-row>
      <div id="fixControllerR" v-if="controlR"></div>
      <div id="fixControllerB"></div>
      <el-col :span="24">
        <el-card shadow="always" class="no-padding-card">
          <div
            id="drop-box"
            @drop="drop($event)"
            @dragover="dragstop($event)"
            @dragleave="dragstop($event)"
          >
            <div
              class="canvasWrapper"
              :style="{width: (canvasWidth)+'px' , height: canvasHeight+'px' }"
            >
              <div v-if="show === 'none'">
                <label for="uploadPic">
                  <p>点击上传或者把图片拖过来</p>
                  <p>Drop your picture here!</p>
                </label>
              </div>
              <div :style="{display: show, 'background-color': '#8c8c8c'}">
                <canvas
                  :style="{display: show}"
                  class="canvas"
                  :width="canvasWidth+ 'px'"
                  :height="canvasHeight+ 'px'"
                ></canvas>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { Rect, Canvas, rectDataContent } from './move.js';
import dataTable from './dataTable';
import {
  debounce,
  scan,
  throttle,
  postData,
  getNameList,
  insertImg,
  postPicFetch
} from '../utils';
import {
  Row,
  Col,
  Button,
  Card,
  Message,
  MessageBox,
  Progress
} from 'element-ui';
import Vue from 'vue';
import Vlf from 'vlf';
Vue.use(Row);
Vue.use(Col);
Vue.use(Button);
Vue.use(Card);
Vue.use(Progress);
Vue.use(Vlf);
import loadingC from '../loading.vue';
const showServerList = () => ({
  component: import(/* webpackChunkName: "showServerList" */ './showServerList.vue'),
  loading: loadingC,
  error: loadingC,
  delay: 200,
  timeout: 5000
});
export default {
  name: 'DataInput',
  components: {
    dataTable,
    showServerList
  },
  data() {
    return {
      show: 'none',
      canvasWidth: 960,
      canvasHeight: 480,
      hwRadio: 9 / 16, //canvas容器的宽高比
      clipNum: 0, //画框的参数
      nowHero: '', //当前角色的名字
      settingButtonsShow: false,
      settingModeButtonsShow: false,
      nowModeTempNum: 0,
      nowMode: {},
      canCheck: false,
      controlR: true,
      picData: [],
      scanPercentage: 0,
      loading: false,
      laodingText: '',
      nameList: [],
      listsShow: false
    };
  },
  props: {
    scanData: {
      validator: arr => {
        let i = 0;
        for (const obj of arr) {
          if (
            !(obj.scanArr instanceof Array) ||
            !(obj.picArr instanceof Array) ||
            !(obj.switch instanceof Function) ||
            !(obj.name !== undefined)
          )
            i -= 1;
        }
        return i > -1;
      },
      offsetTop: Number(),
      offsetLeft: Number()
    }
  },
  computed: {
    modeTemplateList() {
      const list = new Set();
      for (const item of this.scanData) {
        list.add(item.mode);
      }
      return Array.from(list);
    },
    nowModeArr() {
      const self = this,
        mode = this.modeTemplateList[this.nowModeTempNum];
      return this.scanData.filter(item => item.mode === mode);
    }
  },
  async mounted() {
    this.$emit('load');
    this.canvas = new Canvas(this.$el.querySelector('canvas'));
    this.$refs.dataTable.loadLocalData();
    this.loadLocalPic();
    this.calCanvasSize();
    this.nowModeTempNum =
      (await this.$vlf.getItem('mode')) || this.nowModeTempNum;
    //调整canvas的大小
    window.addEventListener('resize', throttle(this.calCanvasSize, 70));
    //监听文件上传
    const uploadEl = this.$el.querySelector('#uploadPic');
    uploadEl.addEventListener('change', () => {
      this.draw(uploadEl.files[0]);
      this.show = 'block';
    });
    this.getNameList();
  },
  methods: {
    //移出*************************************************
    insertServerImgs(lists) {
      for (let pic of lists) {
        const container = document.body.querySelector('#' + pic.name),
          img = new Image();
        img.style.width = '100%';
        img.src = pic.url;
        if (container.childNodes.length > 0) {
          container.childNodes.forEach(node => node.remove());
        }
        container.appendChild(img);
      }
    },
    editServerData(data) {
      this.$refs.dataTable.loadData(data).then(
        Message({
          type: 'info',
          message: '读取服务器数据成功'
        })
      );
    },
    //移出*************************************************
    changeHeroName(e) {
      this.nowHero = e;
      console.log('更名为  ' + e);
    },
    //移出*************************************************
    getNameList() {
      return getNameList()
        .then(arr => {
          // console.log(arr);
          this.nameList = arr;
          return arr;
        })
        .catch(err => {
          console.log(err);
          this.nameList = [];
        });
    },
    //移出*************************************************
    loadLocalPic() {
      return this.$vlf.getItem('picData').then(data => {
        if (!data) return;
        this.picData = data;
        for (let [key, blob] of Object.entries(data)) {
          if (key.indexOf('pic-') !== 0) break;
          const name = key.slice(4);
          const imgContainer = new Image();
          imgContainer.style.width = '100%';
          imgContainer.src = URL.createObjectURL(blob);
          const container = document.querySelector('#' + name);
          if (container.childNodes.length > 0) {
            container.childNodes.forEach(node => node.remove());
          }
          container.appendChild(imgContainer);
        }
      });
    },
    changeMode() {
      const modeTempNum = this.nowModeTempNum;
      this.$vlf.setItem('mode', modeTempNum);
      this.settingModeButtonsShow = false;
    },
    async checkSoulBurn(id) {
      console.log(id);
      const targetR = this.canvas.content.find(
        rect => rect.id === 'scan-skill-description'
      );
      if (!targetR) {
        console.error('没框，你没选技能');
        return;
      }
      const temp = new Rect(this.canvas, {
        id: 'scan-skill-soulBurn',
        name: 'soulBurn',
        x: targetR.x,
        y: targetR.y + targetR.height,
        width: 300,
        height: 80
      });
      this.canvas.clearContent();
      this.canvas.addItem(temp);
      this.reDraw();
      this.canCheck = true;
    },
    //移出*************************************************
    showLists() {
      const h = this.$createElement;
      this.listsShow = true;
      const arr = [];
      if (!this.nameList) {
        Message({
          type: 'info',
          message: '获取列表失败，或者还没有录入任何数据'
        });
        return;
      }
    },
    //移出*************************************************
    async uploadData(data) {
      console.log(data);
      const h = this.$createElement;
      let cancel = false;
      await MessageBox({
        title: '确认内容',
        message: h('p', null, [
          h(
            'p',
            { style: 'color: red' },
            '+++名字+++Importan!     ' + JSON.stringify(data.base.name)
          ),
          h(
            'p',
            { style: 'color: teal' },
            '属性  ' + JSON.stringify(data.base.element)
          ),
          h(
            'p',
            { style: 'color: teal' },
            '星级  ' + JSON.stringify(data.base.stars)
          ),
          h(
            'p',
            { style: 'color: teal' },
            '职业  ' + JSON.stringify(data.base.class)
          )
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => postData(data))
        .then(option => {
          return Message(option);
        })
        .catch(err => {
          Message({
            type: 'info',
            message: '取消上传'
          });
          cancel = true;
        });
      if (cancel) return;
      // console.log(this.picData)
      for (let [key, blob] of Object.entries(this.picData)) {
        const formblob = new FormData();
        formblob.append('name', data.base.name + '-' + key);
        formblob.append('avatar', blob);
        try {
          await postPicFetch(formblob);
        } catch (error) {
          console.log(error);
          Message({
            type: 'error',
            message: '上传失败'
          });
          return;
        }
      }
      Message({
        type: 'success',
        message: '全部上传成功'
      });
      this.$vlf.removeItem('heroData'); //全部上传成功，清空缓存
      this.$vlf.removeItem('picData');
      this.getNameList();
    },
    async recognize() {
      this.canCheck = false;
      const self = this,
        img = this.img,
        scanArr = this.canvas.content.filter(rect => rect.id.match('scan')),
        switchDefault = this.nowMode.switch,
        loadingOption = {
          lock: true,
          text: '识别中，稍等',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        };
      this.scanPercentage = 0;
      this.loading = true;
      this.laodingText = '识别中';
      await scan({
        scanArr,
        switchDefault,
        img,
        self: this
      }).then(resArr => {
        this.laodingText = '完成';
        setTimeout(() => {
          this.loading = false;
        }, 500);
        console.log('扫完');
        console.log(resArr);
        const table = this.$refs.dataTable;
        for (const res of resArr) {
          switch (res.name) {
          case 'one':
            table.dataPartOne = res.obj;
            this.nowHero = res.obj.name;
            table.activeName = 'first';
            break;
          case 'two':
            table.dataPartTwo = res.obj;
            break;
          case 'threePart1':
            table.dataPartThree.missionName = res.obj.name;
            table.dataPartThree.missionDesc = res.obj.description;
            break;
          case 'threePart2':
            table.dataPartThree.command = res.obj.command;
            table.dataPartThree.charm = res.obj.charm;
            table.dataPartThree.politics = res.obj.politics;
            break;
          case 'threePart3':
            table.dataPartThree.background = res.obj.background;
            break;
          case 'skill':
            table.activeName = 'fourth';
            let skill = table.dataPartFour[res.obj.id];
            switch (res.obj.part) {
            case 0:
              skill.desc = res.obj.description;
              skill.name = res.obj.name;
              skill.soul = res.obj.soul;
              skill.cd = res.obj.cd;
              break;
            case 1:
              skill.update = res.obj.update;
              break;
            case 2:
              table.soulburn.expend = res.obj.expend;
              table.soulburn.desc = res.obj.description;
              this.$nextTick().then(() => {
                console.log(res.obj.expend);
              });
              break;
            }
            table.activeSkillName = 'skill' + res.obj.id;
          }
        }
        const isUplaod = this.nameList.find(item => item.name === this.nowHero);
        if (isUplaod) {
          Message({
            type: 'warning',
            message: '已经录入过了，不是修改数据的话，不要随便再上传了'
          });
        }
      });
      //保存一下
      this.$refs.dataTable.saveDataInLocal();
      const hasUpload = this.nameList.find(name => name === this.nowHero);
      if (hasUpload) {
        Message({
          type: 'warning',
          message: '这个已经录入了，建议你换一个录入'
        });
      }
      this.cutImg();
    },
    cutImg(img) {
      const arr = this.canvas.content.filter(rect => rect.id.match('pic'));
      if (arr.length === 0) return;
      return insertImg(arr, this.img)
        .then(obj => {
          console.log('扫图完成');
          this.picData[obj.id] = obj.blob;
          console.log(this.picData);
          this.$vlf.setItem('picData', this.picData);
        })
        .catch(err => console.error(err));
    },
    choseMode(name) {
      this.nowMode = this.nowModeArr.find(e => e.name === name);
      this.canCheck = true;
      this.defaultClip();
      console.log(this.nowMode.name);
      this.$refs.dataTable.nowChose = name;
    },
    defaultClip() {
      this.canvas.clearContent();
      const Sarray = this.nowMode.scanArr,
        Parray = this.nowMode.picArr;
      for (let i in Sarray) {
        const data = Sarray[i],
          temp = new Rect(this.canvas, data);
        this.canvas.addItem(temp);
        console.log(i + 'sarr');
      }
      for (let i in Parray) {
        const data = Parray[i],
          temp = new Rect(this.canvas, data, true);
        this.canvas.addItem(temp);
      }
      this.reDraw();
    },
    saveRect() {
      const arr = this.canvas.content,
        rectArr = [];
      for (let i in arr) {
        rectArr.push(arr[i].toString());
      }
      console.log(JSON.stringify(rectArr));
    },
    reDraw() {
      window.requestAnimationFrame(() => {
        this.canvas.draw(); //箭头函数绑定this
      });
    },
    drawABox() {
      const randomName = Math.floor(Math.random() * 10),
        data = {
          name: randomName,
          id: randomName
        },
        rect = new Rect(this.canvas, data);
      this.canvas.addItem(rect);
      this.reDraw();
    },
    clear() {
      this.canvas.clearContent();
      this.reDraw();
    },
    calCanvasSize() {
      //转到canvas类里算
      this.canvasWidth = this.$el.querySelector('#drop-box').clientWidth;
      this.canvasHeight = this.canvasWidth * this.hwRadio;
      this.canvas.resize(this.canvasWidth, this.canvasHeight);
      this.$nextTick().then(() => {
        this.canvas.draw();
      });
    },
    draw(file) {
      const reader = new FileReader();
      if (typeof file === 'undefined') {
        console.log(typeof file);
        return;
      }
      reader.readAsDataURL(file);
      reader.addEventListener('load', () => {
        const ctx = this.ctx,
          img = (this.img = new Image());
        img.src = reader.result;
        img.classList.add('img');
        img.onload = () => {
          this.canvas.addBg(img);
          console.log(img.height);
          this.canvas.draw();
          this.hwRadio = img.height / img.width;
          // this.canvasHeight = this.canvas.height;
          this.calCanvasSize();
          //移动端点击适配
          console.log(this.offsetTop + '    ' + this.offsetLeft);
          this.canvas.Top = this.offsetTop;
          this.canvas.Left = this.offsetLeft;
        };
      });
    },
    drop(e) {
      e.stopPropagation();
      e.preventDefault();
      const dt = e.dataTransfer,
        file = dt.files[0];
      console.log(file);
      if (typeof file === 'undefined') {
        console.log(typeof file);
        return;
      }
      this.show = 'block';
      this.draw(file);
    },
    dragstop(e) {
      e.stopPropagation();
      e.preventDefault();
    }
  }
};
</script>

<style lang="stylus" scoped>
.no-padding-card {
  .el-card__body {
    padding: 0;
  }
}

#drop-box {
  max-height: 720px;
  max-width: 1280px;
}

.canvasWrapper {
  // position: relative;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .canvas-button {
    position: absolute;
    bottom: -30px;
    font-size: 14px;

    &.clear {
      left: 50px;
    }
  }
}

.file {
  position: relative;
  overflow: hidden;

  input {
    position: absolute;
    font-size: 100px;
    right: 0;
    top: 0;
    opacity: 0;
    width: 100%;
    height: 100%;

    input[type='button'] {
    }
  }
}

#fixControllerR {
  position: absolute;
  background: rgba(0, 0, 0, 0.1);
  width: 45%;
  height: 100%;
  right: 0;
}

#fixControllerB {
  position: absolute;
  background: rgba(0, 0, 0, 0.1);
  width: 55%;
  height: 20%;
  bottom: 0;
  left: 0;
}

.controlWrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.controlRow {
  display: flex;
  margin: 5px 5px 20px;
  padding: 5px;
  flex-wrap: wrap;
  border: 1px #8bc34a33 solid;
  border-radius: 4px;
  min-width: 300px;
}

.choseMode {
  position: absolute;
  right: 20px;
  top: -30px;
}

.loading-fixed {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.7);
  z-index: 99;

  .progress-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
    height: 100%;
  }
}
</style>