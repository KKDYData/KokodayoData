<template>
  <div class="skill-pic-contianer">
    <el-image :src="path" lazy>
      <div slot="error" class="image-slot">
        <i class="el-icon-picture-outline"></i>
      </div>
    </el-image>
    <div class="skill-name-wrapper">
      <span
        :style="skill.levels[0].name.length > 6 ? 'font-size: 13px': ''"
      >{{skill.levels[0].name}}</span>
    </div>
  </div>
</template>

<script>
import { path } from '../../utils/listVer';

import { Image } from 'element-ui';
import Vue from 'vue';
Vue.use(Image);

export default {
  props: {
    skill: {
      required: true
    }
  },
  computed: {
    path() {
      if (!this.skill) return;
      const skill = this.skill;
      const name = skill.iconId ? skill.iconId : skill.skillId;
      return path + 'skills/pics/skill_icon_' + name + '_optimized.png';
    }
  }
};
</script>



<style scoped>
.skill-pic-contianer {
  width: 100px;
  height: 100px;
  position: relative;
  vertical-align: middle;
}

.skill-name-wrapper {
  text-align: center;
  font-size: 15px;
}
@media screen and (max-width: 700px) {
  .skill-pic-contianer {
    width: calc(65px + 1vw);
    height: calc(65px + 1vw);
  }
  .skill-name-wrapper {
    font-size: calc(12px + 0.2vw);
  }
}
</style>
