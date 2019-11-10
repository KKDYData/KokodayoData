<template>
  <div class="info-panel-container">
    <el-tabs :value="activeName">
      <el-tab-pane label="人员档案" name="first">
        <div class="char-half-container-wrapper">
          <el-image class="char-half-container" :src="setData[0].halfPic" fit="contain" lazy>
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <div class="info-char-set-wrapper">
            <el-popover
              :visible-arrow="false"
              placement="top-start"
              :width="getScreenWidth()"
              trigger="click"
            >
              <el-tabs :value="activeSetPane">
                <el-tab-pane label="一般" name="default">
                  <set-panel v-if="showSet" :set-data="setData" :id="data.charID"></set-panel>
                </el-tab-pane>
                <el-tab-pane v-if="skins && skins.length" label="皮肤" name="skins">
                  <set-panel v-if="showSet" :set-data="skins"></set-panel>
                </el-tab-pane>
              </el-tabs>
              <el-button
                style="background: rgba(255, 255, 255, 0.85);"
                @click="showSet=true"
                size="mini"
                slot="reference"
                plain
              >立绘/皮肤</el-button>
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
                  <span>{{p.unLockParam | unlockStr}}</span>
                </div>
                <p v-html="changeText(p.storyText)"></p>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="语音记录" name="second">
        <div class="info-words-wrapper">
          <div v-if="!short && !isMobliePad" style="display: flex; align-items: center">
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
            <p v-html="changeVoice(word.voiceText)">{{word.voiceText}}</p>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { UA, } from '../../utils';
import { path } from '../../utils/listVer';
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
import ContentSlot from '../base/ContentSlot';
import SetPanel from './SetPanel';

import { mapActions, mapState } from 'vuex';

export default {
  components: {
    AudioContainer,
    ContentSlot,
    SetPanel
  },
  props: {
    data: {
      required: true
    },
    list: {
      required: true
    },

    words: {
      required: true
    }
  },
  mounted() {
    this.setExtraSkins();
  },
  data() {
    const normalSetWords = this.data.charID !== 'char_002_amiya' ?
      [
        '干员平时最常穿着的服装。虽然不一定比制服更实用，但是一定是干员最舒适的搭配之一',
        '晋升后，经过调整的服装。根据干员的经验，对服装细节进行改进，针对一些作战环境进行了特化处理。在满足战斗需求的同时，最大程度还原各位干员熟悉的舒适穿着体验。'
      ]
      : [
        '阿米娅最常穿着的服装，过大的尺寸似乎暗示了这件衣服曾不属于她\n不少细节部分都经过手工改造，而时间的痕迹也多有残留。',
        '阿米娅最常穿着的服装，过大的尺寸仿佛述说着这件衣服曾不属于她的事实。即便如此，她也仔细地打理着这件衣服，让它看起来就像新的一样。',
        '衣服需要修补，\n伤痛需要弥合。'
      ];
    return {
      phases: 1,
      showSet: false,
      activeName: 'first',
      currentVoice: null,
      voicePercentage: 0,
      voiceVolume: 100,
      setWords: normalSetWords,
      activeSetPane: 'default',
      path,
      isMobliePad: UA.isMobliePad
    };
  },
  computed: {
    ...mapState(['extraSkins', 'short']),
    style() {
      return !UA.ok
        ? '_optimized.png'
        : '_optimized.png?x-oss-process=style/small-test';
    },
    skins() {
      if (this.extraSkins) {
        return this.extraSkins.filter(el => el.charId === this.data.charID)
          .map(({ displaySkin, avatarId }) => {
            return {
              charSet: this.getSkinSet(avatarId),
              profile: this.getSkinProile(avatarId),
              halfPic: this.getSkinhalfPic(avatarId),
              avatarId: encodeURIComponent(avatarId),
              displaySkin
            };
          });
      }
    },
    setData() {
      if (this.data.charID) {
        return this.list.map((index) => {
          return {
            charSet: path + 'char/set/' + this.data.charID + '_' + index + '.png',
            profile: path + 'char/profile/' + this.data.charID + (index - 1 ? '_' + index : '') + this.style,
            halfPic: path + 'char/halfPic/' + this.data.charID + '_' + index + this.style,
            words: this.setWords[index - 1]
          };
        });
      }
    },

  },
  filters: {
    unlockStr(v) {
      if (/;/.test(v)) {
        const arr = v.split(';');
        return `精英阶段${arr[0]}, 等级${arr[1]}`;
      } else {
        return v;
      }
    },
    filterColor(v) {
      const reg = /<color (name=(.{7}))?>/g;
      const regL = /<\/color>/g;
      return v.replace(reg, '').replace(regL, '');
    }
  },
  methods: {
    ...mapActions(['setExtraSkins']),
    changeVoice(str = '') {
      const reg = new RegExp('{@nickname}', 'g');
      let matches;
      let res = '', lastIndex = 0;
      while ((matches = reg.exec(str)) != null) {
        res += str.substring(lastIndex, matches.index) + '<i style="color:#F49800; font-style: normal">阿凡提#001</i>';
        lastIndex = matches.index + matches[0].length;
      }
      res += str.substring(lastIndex);
      return res;
    },
    getSkinProile(id) {

      console.log(path + 'char/profile/' + id + this.style, id);
      return path + 'char/profile/' + encodeURIComponent(id) + this.style;
    },
    getSkinhalfPic(id) {
      return path + 'char/halfPic/' + encodeURIComponent(id) + this.style;
    },
    getSkinSet(id) {
      return path + 'char/set/' + encodeURIComponent(id) + '.png';
    },
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
    },
    getScreenWidth() {
      const w = document.body.clientWidth;
      const h = window.innerHeight;
      const width = (w < h ? w : h) - 40;
      return width > 1200 ? 1200 : width;
    }
  }
};
</script>


<style lang="stylus" scoped>
.info-char-set-wrapper {
  position: absolute
  bottom: 45px
  right: 1px
}

.info-story-wrapper {
  padding: 0 10px
}

.info-wrapper {
  margin-bottom: 200px
}

.char-half-container-wrapper {
  float: left
  width: 110px
  padding-left: 10px
  overflow: hidden
  position: relative
}

.info-draw-name, .info-cv-name {
  margin-left: 0px
  white-space: nowrap
}

.info-word-audio-control {
  height: 30px
  vertical-align: middle
  padding-left: 20px
}

.info-word-audio-title {
  padding-top: 20px
  display: flex
  align-items: center
}

.info-word-container + .info-word-container {
  border-top: 1px solid #e4e7ed
}

.info-words-wrapper {
  padding: 0 10px
}

.word-control-button {
  font-size: 0
  margin: 0 5px
}

.word-control-button i {
  font-size: 20px
  vertical-align: middle
  cursor: pointer
}

.charset-info {
  position: absolute
  bottom: 20px
}

@media screen and (max-width: 700px) {
  .info-word-audio-control {
    padding-left: 10px
    padding-top: 5px
    display: block
  }
}
</style>

