<template>
  <div class="info-panel-container">
    <el-tabs :value="activeName">
      <el-tab-pane label="人员档案" name="first">
        <div class="char-half-container-wrapper">
          <el-image class="char-half-container" :src="halfPics" fit="contain">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <div class="info-char-set-wrapper">
            <el-popover placement="top-start" :width="short ? '330': '1000'" trigger="click">
              <el-carousel :height="short ? '380px': '1050px'" class="char-set-container-wrapper">
                <el-carousel-item
                  v-for="(pic, index) in charSets"
                  :key="pic"
                  style="font-size:13px"
                >
                  <div v-if="showSet">
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
              <el-button @click="showSet=true" size="mini" slot="reference">查看立绘</el-button>
            </el-popover>
          </div>
          <div class="info-draw-name">
            <span>画师：</span>
            <span>{{data.drawName}}</span>
          </div>
          <div class="info-cv-name">
            <span>CV：</span>
            <span>{{data.infoName}}</span>
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
          <div v-for="(word, index) in words" :key="word.charWordId" class="info-word-container">
            <div class="info-word-audio-title">
              <span>
                <b>{{word.voiceTitle}}</b>
              </span>

              <audio
                style="opacity: 0.5"
                :autoplay="false"
                preload="none"
                class="info-word-audio-control"
                :src="audioPath(word)"
                :ref="'word_'+ index"
                :id="'word_'+ index"
                v-if="0"
              >播放</audio>
            </div>
            <p>{{word.voiceText | docter}}</p>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { path } from "../utils";
import { Carousel, CarouselItem, Tabs, TabPane, Button } from "element-ui";
import Vue from "vue";
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Button);

export default {
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
      activeName: "first"
    };
  },
  filters: {
    docter(value) {
      return value.replace(/{@nickname}/, "阿凡提");
    }
  },
  computed: {
    charSets() {
      if (this.data.charID) {
        const res = [];
        this.list.forEach(index => {
          res.push(
            path + "char/set/" + this.data.charID + "_" + index + ".png"
          );
        });
        return res;
      }
    },
    halfPics() {
      if (this.data.charID) {
        const res = [];
        this.list.forEach(index => {
          res.push(
            path + "char/halfPic/" + this.data.charID + "_" + index + ".png"
          );
        });
        return res[0];
      }
    }
  },
  filters: {
    docter: str => {
      return str.replace(/{@nickname}/, "阿凡提");
    }
  },
  methods: {
    audioPath(data) {
      return (
        path + "char/voice/" + this.data.charID + "/" + data.voiceId + ".wav"
      );
    },
    changeText(str) {
      return str.replace(/(\n)/g, "<br />");
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
  text-align: center;
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
}

.info-draw-name,
.info-cv-name {
  margin-left: 0px;
}

.info-word-audio-control {
  height: 30px;
  vertical-align: middle;
  padding-left: 20px;
}

.info-word-audio-title {
  padding-top: 20px;
}

.info-word-container + .info-word-container {
  border-top: 1px solid #e4e7ed;
}

.info-words-wrapper {
  padding: 0 10px;
}

@media screen and (max-width: 700px) {
  .info-word-audio-control {
    padding-left: 10px;
    padding-top: 5px;
    display: block;
  }
}
</style>

