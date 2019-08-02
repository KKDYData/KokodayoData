<template>
  <div>
    <div id="app">
      <!-- <div class="chars-container">
        <div v-for="char in chars" :key="char.name">
          <p>{{ char.name }}</p>
          <div>
            <draggable
              :list="char.skills"
              :group="{ name: 'people'}"
              class="skills_container"
              @change="log"
            >
              <p v-for="skill in char.skills" :key="skill.name">{{ skill.name }}</p>
            </draggable>
          </div>
        </div>
      </div>-->
      <!-- <draggable
        :list="skills"
        :group="{ name: 'people', pull: 'clone', put: false }"
        class="chars-container"
        @change="log"
        @add="added"
      >-->
      <div class="chars-container">
        <div v-for="(skill) in skills" :key="skill.name" class="skill-container">
          <p>{{ skill.name }}</p>
          <div
            :id="skill.name"
            @drop="drop($event, skill.name)"
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
        </div>
      </div>
      <!-- </draggable> -->
    </div>

    <div class="button">
      <button @click="output">log</button>
    </div>
    <div class="button">
      <button @click="upload">上传图片</button>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import chars from './agent_data_xxx.json';
import skills from './all_skills_group.json';
import { Canvas } from './components/dataInput/move';
chars.forEach(element => {
  element.skills = [];
});
import { postPicFetch } from './utils';

export default {
  components: { draggable },
  data() {
    return {
      skills: skills,
      chars: chars,

      show: 'none',
      canvasWidth: 100,
      canvasHeight: 100,
      hwRadio: 1, //canvas容器的宽高比
      skillPicArr: new Map()
    };
  },
  mounted() {
    // this.canvas = new Canvas(this.$el.querySelector('canvas'));
  },
  methods: {
    log(evt) {
      window.console.log(evt);
    },
    added(index, el) {
      console.log(index);
      console.log(el);
      // this.list.pus
    },
    output() {
      console.log(JSON.stringify(this.chars));
    },
    // clone: function(el) {
    //   return {
    //     name: el.name + " cloned"
    //   };
    // }
    drop(e, name) {
      console.log(name);
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
      this.draw(file, name);
      this.skillPicArr.set(name, file);
    },
    dragstop(e) {
      e.stopPropagation();
      e.preventDefault();
    },
    calCanvasSize() {
      //转到canvas类里算
      // this.canvasWidth = this.$el.querySelector('#drop-box').clientWidth;
      this.canvasHeight = this.canvasWidth * this.hwRadio;
      this.canvas.resize(this.canvasWidth, this.canvasHeight);
      this.$nextTick().then(() => {
        this.canvas.draw();
      });
    },
    draw(file, name) {
      const reader = new FileReader();
      if (typeof file === 'undefined') {
        console.log(typeof file);
        return;
      }
      // console.log(this.$el.querySelector('#' + name).querySelector('canvas'));
      const canvas = (this.canvas = new Canvas(
        this.$el.querySelector('#' + name).querySelector('canvas')
      ));
      console.log(typeof file);
      reader.readAsDataURL(file);
      reader.addEventListener('load', () => {
        const ctx = this.ctx,
          img = new Image();
        img.src = reader.result;
        img.classList.add('img');
        img.onload = () => {
          canvas.addBg(img);
          console.log(img.height);
          canvas.draw();
          this.hwRadio = img.height / img.width;
          // canvasHeight = canvas.height;
          // this.calCanvasSize();
        };
      });
    },
    clear() {
      this.canvas.clearContent();
      this.reDraw();
    },
    reDraw() {
      window.requestAnimationFrame(() => {
        this.canvas.draw(); //箭头函数绑定this
      });
    },
    upload() {
      this.skillPicArr.forEach(async (v, k) => {
        console.log(k);
        const formblob = new FormData();
        formblob.append('name', k);
        formblob.append('avatar', v);
        try {
          await postPicFetch(formblob);
        } catch (error) {
          console.log(error);
        }
      });
    }
  }
};
</script>


<style>
/* .button {
} */

#app {
  /* max-width: 400px; */
  margin: 0 auto;
  line-height: 1.4;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* color: $vue-blue; */
  display: flex;
  align-content: space-around;
  justify-content: space-around;
}

.chars-container {
  /* margin-right: 20px; */
  border-right: 1px solid green;
  padding-right: 20vw;
  height: 1000px;
  overflow: scroll;
  width: 800px;
  margin: 0 auto;
}

.skills_container {
  height: 200px;
  border-bottom: 1px solid red;
}
h1 {
  text-align: center;
}
.skill-container {
  padding-bottom: 50px;
  width: 500px;
  border: 1px solid black;
}
#drop-box {
  width: 100%;
  border: 1px solid black;
}
</style>
