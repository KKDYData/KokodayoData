<template>
  <div class="info-panel-container">
    <el-tabs :value="activeName">
      <el-tab-pane label="人员档案" name="first">
        <div class="char-base-info-container">
          <div class="char-set-cv">
            <div class="char-half-container">
              <div class="image-inner" :style="{backgroundImage: `url('${setData[0].halfPic}')`}" />
            </div>
          </div>
          <div class="info-painter-cv">
            <content-slot class="info-painter-cv-item" :width="60" long no-wrap>
              <div slot="title">画师</div>
              <div slot="content">{{ data.drawName }}</div>
            </content-slot>
            <content-slot class="info-painter-cv-item" :width="60" long no-wrap>
              <div slot="title">CV</div>
              <div slot="content">{{ data.infoName }}</div>
            </content-slot>
            <div class="info-char-set-wrapper">
              <h-popping no-title placement="top-start" :width="width" size="90%" trigger="click">
                <el-tabs :value="activeSetPane" style="padding-top: 5px">
                  <el-tab-pane label="一般" name="default">
                    <set-panel v-if="showSet" :id="data.charID" :set-data="setData" />
                  </el-tab-pane>
                  <el-tab-pane v-if="skins && skins.length" label="皮肤" name="skins">
                    <set-panel v-if="showSet" :set-data="skins" />
                  </el-tab-pane>
                </el-tabs>
                <el-button
                  slot="reference"
                  style="background: rgba(255, 255, 255, 0.85); margin-top: 10px"
                  size="mini"
                  @click="showSet=true"
                >
                  立绘/皮肤
                  <i class="el-icon-search" />
                </el-button>
              </h-popping>
            </div>
          </div>

          <div
            v-for="(story, index) in baseInfo"
            :key="story.storyTitle"
            class="info-base-container"
          >
            <div class="info-story-title">
              <span>
                <b>{{ story.storyTitle }}</b>
              </span>
            </div>
            <div class="info-story-content-wrapper">
              <div v-for="([k, v], i) in story.data" :key="k" class="info-story-content">
                <content-slot
                  long
                  :no-wrap="true"
                  :width="i < (index === 0 ? 7 : 5) ? 70 : null"
                  :long-content="( i === 7 || (index !== 0 && i ===5) )"
                >
                  <div slot="title">{{ k }}</div>
                  <div slot="content">{{ v }}</div>
                </content-slot>
              </div>
            </div>
          </div>
        </div>
        <div class="info-token-desc">
          <content-slot long-content :width="145">
            <div slot="title">信物描述</div>
            <div slot="content">{{ data.tokenDesc }}</div>
          </content-slot>
        </div>
        <div class="info-story-wrapper">
          <div v-for="story in data.storyTextAudio.slice(2)" :key="story.storyTitle">
            <content-slot :width="145" long-content>
              <div slot="title">
                <span>{{ story.storyTitle }}</span>
              </div>
              <div slot="content">
                <div v-for="(p, index) in story.stories" :key="index" class="info-story-content">
                  <div v-if="p.unLockParam !== ''" class="info-story-content-unlock">
                    <span>解锁需要好感：</span>
                    <span>{{ p.unLockParam | unlockStr }}</span>
                  </div>
                  <p v-html="changeText(p.storyText)" />
                </div>
              </div>
            </content-slot>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="语音记录" name="second">
        <div class="info-word-wrapper">
          <div v-if="!short && !isMobliePad" style="display: flex; align-items: center">
            <div style="padding-right: 10px">
              <span>volume:</span>
            </div>
            <div style="display:inline-block;width: 100px">
              <el-slider
                v-model="voiceVolume"
                color="#ca3e47"
                :show-text="false"
                @change="e => voiceVolume = e"
              />
            </div>
          </div>
          <div v-for="(word, index) in words" :key="word.charWordId" class="info-word">
            <div class="info-word-audio">
              <div class="info-word-audio-title">
                <b>{{ word.voiceTitle }}</b>
              </div>
              <template v-if="data.infoName !== '--'">
                <div class="info-word-audio-buttonn" @click="playVoice(index)">
                  <i class="el-icon-video-play" />
                </div>
                <div class="info-word-audio-buttonn" @click="pausePlayVoice(index)">
                  <i class="el-icon-video-pause" />
                </div>
                <audio-container
                  v-if="currentVoice === index"
                  ref="word"
                  :volume="voiceVolume"
                  :src="audioPath(word)"
                />
              </template>
            </div>
            <p v-html="changeVoice(word.voiceText)">{{ word.voiceText }}</p>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { UA, getSkinsData, getScreenWidth, sort } from '../../utils'
import { path } from '../../utils/listVer'
import { Tabs, TabPane, Button, Slider, } from 'element-ui'
import Vue from 'vue'

Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Button)
Vue.use(Slider)

import AudioContainer from './AudioContainer'
import HPopping from '@/components/base/Popping'
import SetPanel from '../base/SetPanel'
import ContentSlot from '../base/ContentSlot'

import { mapActions, mapState } from 'vuex'

export default {
  components: {
    AudioContainer,
    SetPanel,
    ContentSlot,
    HPopping
  },
  filters: {
    unlockStr(v) {
      if (/;/.test(v)) {
        const arr = v.split(';')
        return `精英阶段${arr[0]}, 等级${arr[1]}`
      } else {
        return v
      }
    },
    filterColor(v) {
      const reg = /<color (name=(.{7}))?>/g
      const regL = /<\/color>/g
      return v.replace(reg, '').replace(regL, '')
    }
  },
  props: {
    data: {
      default() {
        return {}
      },
      type: Object,
      required: true
    },
    list: {
      required: true,
      type: Array
    },
    words: {
      type: Array,
      required: true
    }
  },
  data() {
    const normalSetWords =
      this.data.charID !== 'char_002_amiya'
        ? [
          '干员平时最常穿着的服装。虽然不一定比制服更实用，但是一定是干员最舒适的搭配之一',
          '晋升后，经过调整的服装。根据干员的经验，对服装细节进行改进，针对一些作战环境进行了特化处理。在满足战斗需求的同时，最大程度还原各位干员熟悉的舒适穿着体验。'
        ]
        : [
          '阿米娅最常穿着的服装，过大的尺寸似乎暗示了这件衣服曾不属于她\n不少细节部分都经过手工改造，而时间的痕迹也多有残留。',
          '阿米娅最常穿着的服装，过大的尺寸仿佛述说着这件衣服曾不属于她的事实。即便如此，她也仔细地打理着这件衣服，让它看起来就像新的一样。',
          '衣服需要修补，\n伤痛需要弥合。'
        ]
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
      isMobliePad: UA.isMobliePad,
      width: getScreenWidth().width
    }
  },

  computed: {
    ...mapState(['extraSkins', 'short']),
    style() {
      return !UA.ok
        ? '.png'
        : '.png?x-oss-process=style/small-test'
    },
    skins() {
      if (this.extraSkins) {
        return this.extraSkins
          .filter(el => el.charId === this.data.charID)
          .map(data => getSkinsData.skins(data))
      } else return null
    },
    setData() {
      if (this.data.charID) {
        return this.list.map(index => {
          return {
            charSet: path + 'char/set/' + this.data.charID + '_' + index + '.png',
            profile: path + 'char/profile/' + this.data.charID + (index - 1 ? '_' + index : '') + this.style,
            halfPic: path + 'char/halfPic/' + this.data.charID + '_' + index + this.style,
            words: this.setWords[index - 1]
          }
        })
      }
      return null
    },
    baseInfo() {
      if (!this.data) return
      return this.data.storyTextAudio
        .slice(0, 2)
        .map(({ stories, storyTitle }, i, arr) => {
          const base = stories
            .map(({ storyText }) => storyText)
            .map(str => {
              const reg = new RegExp('【(.+)】(.+)\\n', 'g')
              let matches
              let res = []
              while ((matches = reg.exec(str)) != null) {
                res.push(matches.slice(1, 3))
              }
              const lReg = /【(.{7})】\n?(.+)$/
              const last = lReg.exec(str)
              if (last) res.push(last.slice(1, 3))
              return res
            })[0]
          const data = sort(base, ((pre, cur) => pre[0].length < cur[0].length))
          return {
            data,
            storyTitle
          }
        })
    }
  },
  mounted() {
    this.setExtraSkins()
  },

  methods: {
    ...mapActions(['setExtraSkins']),
    changeVoice(str = '') {
      const reg = new RegExp('{@nickname}', 'g')
      let matches
      let res = '',
        lastIndex = 0
      while ((matches = reg.exec(str)) != null) {
        res +=
          str.substring(lastIndex, matches.index) +
          '<i style="color:#F49800; font-style: normal">阿凡提#001</i>'
        lastIndex = matches.index + matches[0].length
      }
      res += str.substring(lastIndex)
      return res
    },
    async playVoice(index) {
      this.currentVoice = index
      await this.$nextTick()
      const a = this.$refs['word']
      a[0].play()
    },
    pausePlayVoice(index) {
      if (index !== this.currentVoice) return
      const a = this.$refs['word']
      if (a[0]) a[0].pause()
    },
    audioPath(data) {
      return (
        path + 'char/voice/' + this.data.charID + '/' + data.voiceId + '.mp3'
      )
    },
    changeText(str) {
      return str.replace(/(\n)/g, '<br />')
    },
    calPhases(index) {
      if (index === 1) return 0
      else if (index === 2) return 2
      else return 1
    },
  }
}
</script>


<style lang="stylus" scoped>
@import '../../styles/char.styl'

.char-base-info-container {
  display: flex
  margin-bottom: 70px
  justify-content: space-between
  max-width: 800px
}

.info-char-set-wrapper {
  bottom: 45px
  right: 1px
}

.info-story-wrapper {
  //padding: 0 10px
}

.info-word {
  & + & {
    border-top: 1px solid #e4e7ed
  }

  &-audio {
    padding-top: 20px
    display: flex
    align-items: center

    &-title {
      padding-right: 5px
    }

    &-control {
      height: 30px
      vertical-align: middle
      padding-left: 20px
    }

    &-buttonn {
      font-size: 0
      margin: 0 5px

      i {
        font-size: 20px
        vertical-align: middle
        cursor: pointer
      }
    }
  }

  &-wrapper {
    padding: 0 10px
  }
}

.info-base-container {
  max-width: 250px

  & + & {
    padding-left: 20px
  }
}

.info-painter-cv {
  padding-left: 20px
  box-sizing: border-box

  &-item {
    margin-top: 10px
  }
}

.info-token-desc {
  margin: 20px 0 50px
}

@media screen and (max-width: 700px) {
  .info-base-container {
    & + & {
      padding-left: 5vw
      box-sizing: border-box
    }
  }

  .info-painter-cv {
    padding-left: 5vw
    min-width: 50%
    box-sizing: border-box
  }

  .info-word-audio-control {
    padding-left: 10px
    padding-top: 5px
    display: block
  }

  .info-base-container {
    max-width: vw(335)
  }

  .char-base-info-container {
    flex-wrap: wrap
    justify-content: flex-start
    margin-bottom: 30px
  }

  .char-set-cv {
    margin-bottom: 30px
  }
}

@media screen and (max-width: 500px) {
  .info-base-container {
    & + & {
      padding-left: 1vw
    }
  }

  .info-painter-cv {
    &-item {
      margin-top: vw(10)
    }
  }

  .info-token-desc {
    margin: vw(20) 0 vw(60)
  }
}
</style>

