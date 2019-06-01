<template>
  <div class="tttt">
    <div class="group-container-title">
      <span>基建技能</span>
    </div>
    <div class="talent-container-wrapper">
      <div v-for="(item, index) in building" :key="index" class="talent-container">
        <div class="talent-name-wrapper">
          <span>{{item[0].data.buffName}}</span>
          <div class="talent-desc-change-button"></div>
        </div>
        <div class="talent-desc-container" v-for="build in item" :key="build.id">
          <div class="talent-condition-wrapper">
            <span>精英{{build.cond.phase}}/{{build.cond.level}}级</span>
          </div>
          <div class="talent-desc-content-wrapper">
            <div class="talent-desc-content">
              <span v-html="changeDesc(build.data.description)"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { changeDesc } from '../utils';

export default {
  props: {
    building: {
      required: true
    }
  },
  data() {
    return {
      showTalentPotencailUP: [false, false, false]
    };
  },
  methods: {
    changeDesc(desc) {
      return changeDesc(desc);
    }
  }
};
</script>

<style scoped>
.tttt {
  margin-bottom: 20px;
}
.talent-name-wrapper,
.talent-container-wrapper {
  display: flex;
  position: relative;
  flex-wrap: wrap;
}
.talent-container-wrapper {
  min-width: 700px;
}

.talent-container {
  width: calc(50% - 2px);
  min-width: 350px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  align-content: center;
  position: relative;
}

.talent-container + .talent-container {
  border-left: 2px solid rgba(56, 56, 56, 0.6);
}

/* 天赋名字 */
.talent-name-wrapper {
  position: absolute;
  height: 100%;
  width: 110px;
  border-right: 1px solid rgba(158, 158, 158, 0.4);
  display: flex;
  align-items: center;
}
.talent-name-wrapper span {
  padding-left: 10px;
}

/* 天赋内容 */
.talent-desc-container {
  padding: 5px 10px;
  position: relative;
  min-width: 250px;
  height: 60px;
  width: calc(100% - 120px);
  margin-left: 120px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  align-content: center;
}

.talent-condition-wrapper {
  padding-right: 10px;
  width: 100px;
}

.talent-desc-content-wrapper {
  position: relative;
  display: inline-block;
  flex-grow: 1;
  padding-right: 10px;
  width: calc(300px + 5%);
}

.talent-desc-change-button {
  position: absolute;
  bottom: 10px;
  width: 100%;
  text-align: center;
}
.talent-desc-change-button .el-button--mini {
  padding: 0;
}

@media screen and (max-width: 700px) {
  .talent-container-wrapper {
    min-width: 350px;
  }
  .talent-container {
    width: calc(100% - 2px);
    min-width: 300px;
    margin-bottom: 20px;
  }

  .talent-container + .talent-container {
    border: none;
    padding-top: 20px;
    border-top: 2px solid rgba(56, 56, 56, 0.6);
  }

  .talent-name-wrapper {
    position: relative;
    height: 20px;
    width: calc(100% - 20px);
    border-right: none;
    border-bottom: 1px solid rgba(158, 158, 158, 0.4);
  }

  /* 天赋内容 */
  .talent-desc-container {
    height: 60px;
    width: 100%;
    margin-left: 0px;
    flex-wrap: wrap;
    margin-top: 20px;
  }
  .talent-desc-container + .talent-desc-container {
    padding-top: 20px;
    border-top: 1px solid rgba(158, 158, 158, 0.4);
  }

  .talent-condition-wrapper {
    width: calc(100% - 10px);
    padding-bottom: 10px;
    font-size: 13px;
    direction: rtl;
  }
  .talent-condition-wrapper span {
    border-bottom: 2px solid rgba(247, 203, 10, 0.582);
  }

  .talent-desc-content {
    padding-bottom: 10px;
    position: relative;
    display: inline-block;
    padding-right: 10px;
    font-size: 15px;
  }

  .talent-desc-change-button {
    right: 0px;
    width: auto;
    /* text-align: right; */
  }
}
</style>
