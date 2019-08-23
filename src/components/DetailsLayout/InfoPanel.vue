<template>
  <div class="info-panel-container">
    <el-tabs :value="activeName">
      <el-tab-pane label="人员档案" name="first">
        <div class="char-half-container-wrapper">
          <el-image class="char-half-container" :src="halfPics" fit="contain" lazy>
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <div class="info-char-set-wrapper">
            <el-popover
              :visible-arrow="false"
              placement="top-start"
              :width="short ? '330': '1000'"
              trigger="click"
            >
              <el-carousel
                :autoplay="false"
                :height="short ? '380px': '1050px'"
                class="char-set-container-wrapper"
                indicator-position="outside"
                :loop="false"
              >
                <el-carousel-item
                  v-for="(pic, index) in charSets"
                  :key="pic"
                  style="font-size:13px"
                >
                  <div v-if="showSet" style="background: rgba(255, 255, 255, 0.85);">
                    <el-image class="char-set-container" :src="pic">
                      <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline"></i>
                      </div>
                    </el-image>
                  </div>
                  <p>
                    精英化阶段{{calPhases(list[index])}}
                    <span>长按或者右键可以下载</span>
                  </p>
                </el-carousel-item>
              </el-carousel>
              <el-button
                style="background: rgba(255, 255, 255, 0.85);"
                @click="showSet=true"
                size="mini"
                slot="reference"
                plain
              >查看立绘</el-button>
            </el-popover>
          </div>
          <div class="info-draw-name">
            <span style="width: 32px; display: inline-block">画师</span>
            <span>: {{data.drawName}}</span>
          </div>
          <div class="info-cv-name">
            <span style="width: 32px; display: inline-block">CV</span>
            <span>: {{data.infoName}}</span>
          </div>
        </div>
        <div class="info-story-wrapper">
          <div v-for="(story,index) in data.storyTextAudio" :key="story.storyTitle">
            <div class="info-story-title" :style="index === 0 ? 'margin-left: 160px': ''">
              <span>
                <b>{{story.storyTitle}}</b>
              </span>
            </div>
            <div
              class="info-story-content-wrapper"
              :style="index === 0 ? 'margin-left: 160px; min-height: 267px': ''"
            >
              <div class="info-story-content" v-for="(p, index) in story.stories" :key="index">
                <div class="info-story-unlock" v-if="p.unLockParam !== ''">
                  <span>解锁需要好感：</span>
                  <span>{{p.unLockParam}}</span>
                </div>
                <p v-html="changeText(p.storyText)"></p>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="语音记录" name="second">
        <div class="info-words-wrapper">
          <div style="display: flex; align-items: center">
            <div style="padding-right: 10px">
              <span>volume:</span>
            </div>
            <div style="display:inline-block;width: 100px">
              <el-slider
                @change="e => voiceVolume = e"
                v-model="voiceVolume"
                color="#ca3e47"
                :show-text="false"
              ></el-slider>
            </div>
          </div>
          <div v-for="(word, index) in words" :key="word.charWordId" class="info-word-container">
            <div class="info-word-audio-title">
              <div style="padding-right: 5px;">
                <b style="line-height:20px">{{word.voiceTitle}}</b>
              </div>
              <template v-if="data.infoName !== '--'">
                <div @click="playVoice(index)" class="word-control-button">
                  <i class="el-icon-video-play"></i>
                </div>
                <div @click="pausePlayVoice(index)" class="word-control-button">
                  <i class="el-icon-video-pause"></i>
                </div>
                <audio-container
                  ref="word"
                  v-if="currentVoice === index"
                  :volume="voiceVolume"
                  :src="audioPath(word)"
                ></audio-container>
              </template>
            </div>
            <p>{{word.voiceText | docter}}</p>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { path, webpOk } from '../../utils';
import {
  Carousel,
  CarouselItem,
  Tabs,
  TabPane,
  Button,
  Progress,
  Slider,
} from 'element-ui';
import Vue from 'vue';
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Button);
Vue.use(Progress);
Vue.use(Slider);
import AudioContainer from './AudioContainer';



export default {
  components: {
    AudioContainer
  },
  props: {
    data: {
      required: true
    },
    list: {
      required: true
    },
    short: {
      required: true
    },
    words: {
      required: true
    }
  },
  data() {
    return {
      phases: 1,
      showSet: false,
      activeName: 'first',
      currentVoice: null,
      voicePercentage: 0,
      voiceVolume: 100
    };
  },
  computed: {
    charSets() {
      if (this.data.charID) {
        const res = [];
        this.list.forEach(index => {
          res.push(
            path + 'char/set/' + this.data.charID + '_' + index + '.png'
          );
        });
        return res;
      }
    },
    halfPics() {
      if (this.data.charID) {
        const res = [];

        const style = !webpOk
          ? '_optimized.png'
          : '_optimized.png?x-oss-process=style/small-test';
        this.list.forEach(index => {
          res.push(
            path + 'char/halfPic/' + this.data.charID + '_' + index + style
          );
        });
        return res[0];
      }
    }
  },
  filters: {
    docter: str => {
      return str.replace(/{@nickname}/, '阿凡提');
    }
  },
  methods: {
    async playVoice(index) {
      this.currentVoice = index;
      await this.$nextTick();
      const a = this.$refs['word'];
      a[0].play();
    },
    pausePlayVoice(index) {
      if (index !== this.currentVoice) return;
      const a = this.$refs['word'];
      if (a[0]) a[0].pause();
    },
    audioPath(data) {
      return (
        path + 'char/voice/' + this.data.charID + '/' + data.voiceId + '.mp3'
      );
    },
    changeText(str) {
      return str.replace(/(\n)/g, '<br />');
    },
    calPhases(index) {
      if (index === 1) return 0;
      else if (index === 2) return 2;
      else return 1;
    }
  }
};
</script>


<style  scoped>
.info-char-set-wrapper {
  position: absolute;
  bottom: 45px;
  right: 1px;
}
.info-story-wrapper {
  padding: 0 10px;
}

.info-wrapper {
  margin-bottom: 200px;
}

.char-half-container {
  width: 120px;
  height: 210px;
}

.char-half-container-wrapper {
  float: left;
  width: 120px;
  padding-left: 10px;
  overflow: hidden;
  position: relative;
}

.info-draw-name,
.info-cv-name {
  margin-left: 0px;
  white-space: nowrap;
}

.info-word-audio-control {
  height: 30px;
  vertical-align: middle;
  padding-left: 20px;
}

.info-word-audio-title {
  padding-top: 20px;
  display: flex;
  align-items: center;
}

.info-word-container + .info-word-container {
  border-top: 1px solid #e4e7ed;
}

.info-words-wrapper {
  padding: 0 10px;
}

.word-control-button {
  font-size: 0;
  margin: 0 5px;
}
.word-control-button i {
  font-size: 20px;
  vertical-align: middle;
  cursor: pointer;
}

@media screen and (max-width: 700px) {
  .info-word-audio-control {
    padding-left: 10px;
    padding-top: 5px;
    display: block;
  }
}
</style>

