<template>
  <div>
    <div style="display:inline-block; width: 100px;">
      <el-progress :show-text="false" :percentage="voicePercentage" color="rgb(82, 82, 82)"></el-progress>
    </div>
    <audio
      id="word"
      ref="word"
      :autoplay="false"
      preload="none"
      class="info-word-audio-control"
      :src="src"
      @timeupdate="timeUpDate($event)"
      @durationchange="durationUpdate($event)"
    >
      <span>
        Your browser doesn't support HTML5 audio. Here is a
        <a :href="src">link to the audio</a> instead.
      </span>
    </audio>
  </div>
</template>

<script>
import { Message, Progress } from 'element-ui'
import Vue from 'vue'
Vue.use(Progress)

export default {
  props: {
    src: {
      required: true
    },
    volume: {
      default: 100,
      type: Number
    }
  },
  data() {
    return {
      voicePercentage: 0,
      duration: 30,
    }
  },
  watch: {
    volume(e) {
      this.$refs.word.volume = e / 100
    }
  },
  mounted() {
    this.$refs.word.volume = this.volume / 100
  },
  methods: {
    durationUpdate(e) {
      if (e.target.duration !== Infinity) {
        // Message.success('get the change ' + e.target.duration);
        this.duration = e.target.duration
      }
    },
    timeUpDate(e) {
      try {
        this.voicePercentage = Math.min(e.target.currentTime / this.duration * 100, 100)
        // Message(this.voicePercentage + ' | ' + e.target.currentTime + ' | ' + this.duration);
      } catch (error) {
        Message(JSON.stringify(error))
      }
    },
    play() {
      this.$refs.word.play().catch(err => {
        console.log(err)
        Message.error('语音数据可能还没压缩上传，过一会再来听吧' + ' | err : ' + JSON.stringify(err))
      })
    },
    pause() {
      this.$refs.word.pause()
    }
  }
}
</script>

