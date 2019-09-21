<template>
  <div>
    <div style="display:inline-block; width: 100px;">
      <el-progress :show-text="false" :percentage="voicePercentage" color="rgb(82, 82, 82)"></el-progress>
    </div>
    <audio
      :autoplay="false"
      preload="none"
      class="info-word-audio-control"
      :src="src"
      ref="word"
      id="word"
      @timeupdate="timeUpDate($event)"
    >
      <span>
        Your browser doesn't support HTML5 audio. Here is a
        <a :href="src">link to the audio</a> instead.
      </span>
    </audio>
  </div>
</template>

<script>
import { Message } from 'element-ui';
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
      voicePercentage: 0
    };
  },
  mounted() {
    this.$refs.word.volume = this.volume / 100;
  },
  watch: {
    volume(e) {
      this.$refs.word.volume = e / 100;
    }
  },
  methods: {
    timeUpDate(e) {
      this.voicePercentage = e.target.currentTime * 100 / e.target.duration;
    },
    play() {
      this.$refs.word.play().catch(err => {
        console.log(err);
        Message.error('语音数据可能还没压缩上传，过一会再来听吧');
      });
    },
    pause() {
      this.$refs.word.pause();
    }
  }
};
</script>

