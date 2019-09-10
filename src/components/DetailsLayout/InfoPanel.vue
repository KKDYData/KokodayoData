<template>
  <div class="info-panel-container">
    <el-tabs :value="activeName">
      <el-tab-pane label="人员档案" name="first">
        <div class="char-half-container-wrapper">
          <el-image class="char-half-container" :src="halfPics[0]" fit="contain" lazy>
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
                  <el-carousel
                    :height="(getScreenWidth() + (short ? 60 : 0)) + 'px'"
                    :autoplay="false"
                    class="char-set-container-wrapper"
                    indicator-position="outside"
                    :loop="false"
                  >
                    <el-carousel-item
                      v-for="(pic, index) in charSets"
                      :key="pic"
                      style="font-size:13px"
                    >
                      <div v-if="showSet" class="char-set-contianer-wrapper" style>
                        <div v-if="!short">
                          <div class="char-profile-container">
                            <el-image :src="profileList[index]"></el-image>
                          </div>
                          <div class="char-half-container">
                            <el-image :src="halfPics[index]"></el-image>
                          </div>
                        </div>
                        <div>
                          <el-image class="char-set-container" :src="pic">
                            <div slot="error" class="image-slot">
                              <i class="el-icon-picture-outline"></i>
                            </div>
                          </el-image>
                        </div>
                      </div>
                      <div>{{setWords[index]}}</div>
                    </el-carousel-item>
                  </el-carousel>
                </el-tab-pane>
                <el-tab-pane v-if="skins && skins.length" label="皮肤" name="skins">
                  <el-carousel
                    :height="(getScreenWidth() + (short ? 60 : 0)) + 'px'"
                    :autoplay="false"
                    class="char-set-container-wrapper"
                    indicator-position="outside"
                    :loop="false"
                  >
                    <el-carousel-item
                      v-for="({avatarId, displaySkin}) in skins"
                      :key="avatarId"
                      style="font-size:13px"
                    >
                      <div v-if="showSet" class="char-set-contianer-wrapper" style>
                        <div v-if="!short">
                          <div class="char-profile-container">
                            <el-image :src="getSkinProile(avatarId)"></el-image>
                          </div>
                          <div class="char-half-container">
                            <el-image :src="getSkinhalfPic(avatarId)"></el-image>
                          </div>
                          <div style="width: 20vw; max-width: 200px">
                            <content-slot style="margin-top: 10px" :long="true" :no-wrap="true">
                              <template slot="title">系列</template>
                              <template slot="content">{{displaySkin.skinGroupName}}</template>
                            </content-slot>
                            <content-slot style="margin-top: 10px" :long="true" :no-wrap="true">
                              <template slot="title">获得方式</template>
                              <template slot="content">{{displaySkin.obtainApproach}}</template>
                            </content-slot>
                            <content-slot style="margin-top: 10px" :long="true" :no-wrap="true">
                              <template slot="title">描述</template>
                              <template slot="content">{{displaySkin.usage}}</template>
                            </content-slot>
                            <content-slot style="margin-top: 10px" :long="true" :no-wrap="true">
                              <template slot="title">记录</template>
                              <template slot="content">{{displaySkin.content | filterColor}}</template>
                            </content-slot>
                          </div>
                        </div>
                        <div>
                          <el-image class="char-set-container" :src="getSkinSet(avatarId)">
                            <div slot="error" class="image-slot">
                              <i class="el-icon-picture-outline"></i>
                            </div>
                          </el-image>
                        </div>
                      </div>
                      <div v-if="short">{{displaySkin.content | filterColor}}</div>
                    </el-carousel-item>
                  </el-carousel>
                </el-tab-pane>
              </el-tabs>
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
import ContentSlot from '../ContentSlot';

import { mapActions, mapState } from 'vuex';

export default {
  components: {
    AudioContainer,
    ContentSlot
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
      path
    };
  },
  computed: {
    ...mapState(['extraSkins']),
    style() {
      return !webpOk
        ? '_optimized.png'
        : '_optimized.png?x-oss-process=style/small-test';
    },
    skins() {
      if (this.extraSkins) {
        return this.extraSkins.filter(el => el.charId === this.data.charID);
      }
    },
    charSets() {
      if (this.data.charID) {
        return this.list.reduce((res, index) => {
          res.push(path + 'char/set/' + this.data.charID + '_' + index + '.png');
          return res;
        }, []);
      }
    },
    profileList() {
      if (this.data.charID) {
        return this.list.reduce((res, index) => {
          res.push(path + 'char/profile/' + this.data.charID + (index - 1 ? '_' + index : '') + this.style);
          return res;
        }, []);
      }
    },
    halfPics() {
      if (this.data.charID) {
        return this.list.reduce((res, index) => {
          res.push(path + 'char/halfPic/' + this.data.charID + '_' + index + this.style);
          return res;
        }, []);
      }
    }
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
    docter: str => {
      return str.replace(/{@nickname}/, '阿凡提');
    },
    filterColor(v) {
      const reg = /<color (name=(.{7}))?>/g;
      const regL = /<\/color>/g;
      console.log(v, v.replace(reg, ''), v.replace(reg, '').replace(regL, ''));
      return v.replace(reg, '').replace(regL, '');
    }
  },
  methods: {
    ...mapActions(['setExtraSkins']),
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
      return width > 1000 ? 1000 : width;
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
  width: 110px;
  height: 240px;
}
.char-profile-container {
  width: 110px;
  height: 110px;
}

.char-half-container-wrapper {
  float: left;
  width: 110px;
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

.charset-info {
  position: absolute;
  bottom: 20px;
}
.char-set-contianer-wrapper {
  background: rgba(255, 255, 255, 0.85);
  display: flex;
}

@media screen and (max-width: 700px) {
  .info-word-audio-control {
    padding-left: 10px;
    padding-top: 5px;
    display: block;
  }
}
</style>

