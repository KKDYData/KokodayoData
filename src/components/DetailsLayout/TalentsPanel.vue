<template>
  <div class="tttt">
    <div class="talent-container-wrapper">
      <div v-for="(item, index) in talents" :key="item.name" class="talent-container">
        <div class="talent-name-wrapper">
          <span :style="!short && item.name.length > 5 ? 'font-size: 13px': ''">{{item.name}}</span>
          <div class="talent-desc-change-button">
            <el-button
              v-if="item.condidate[0].potentailUP"
              @click="openTalentPotentailUP(index)"
              size="mini"
              :type="!showTalentPotencailUP[index] ? 'info' : 'warning'"
            >
              潜能提升
              <i
                :class="!showTalentPotencailUP[index] ? 'el-icon-star-off' : 'el-icon-star-on'"
              ></i>
            </el-button>
          </div>
        </div>
        <div
          class="talent-desc-container"
          v-for="talent in item.condidate"
          :key="talent.description"
        >
          <div class="talent-condition-wrapper">
            <span>精英{{talent.unlockCondition.phase}}/{{talent.unlockCondition.level}}级</span>
          </div>

          <div class="talent-desc-content-wrapper">
            <div v-if="!showTalentPotencailUP[index]" class="talent-desc-content">
              <span v-html="talent.description"></span>
            </div>
            <div v-else class="talent-desc-content">
              <span v-html="talent.potentailUP.description"></span>
              <span>(需要潜能{{talent.potentailUP.requiredPotentialRank + 1}}级)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    talents: {
      required: true
    },
    short: Boolean
  },
  data() {
    return {
      showTalentPotencailUP: [false, false, false]
    };
  },
  methods: {
    openTalentPotentailUP(t) {
      this.$set(this.showTalentPotencailUP, t, !this.showTalentPotencailUP[t]);
    }
  }
};
</script>

<style scoped>
.group-container-title {
  border-bottom: 1px solid rgb(235, 238, 245);
  font-weight: bold;
  color: white;
  margin-bottom: 20px;
  background-color: #414141;
  padding-left: 1vw;
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
  width: calc(50% - 7px);
  min-width: 350px;
  margin: 10px 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  align-content: center;
  position: relative;
}

.talent-container:nth-child(2n) {
  border-left: 2px solid rgba(56, 56, 56, 0.6);
  padding-left: 10px;
}

/* 天赋名字 */
.talent-name-wrapper {
  position: absolute;
  height: 100%;
  width: 90px;
  border-right: 1px solid rgba(158, 158, 158, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 天赋内容 */
.talent-desc-container {
  padding: 5px 10px;
  position: relative;
  min-width: 250px;
  min-height: 60px;
  width: calc(100% - 120px);
  margin-left: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  align-content: center;
}

.talent-condition-wrapper {
  padding-right: 10px;
  width: 100px;
  word-break: keep-all;
}

.talent-desc-content-wrapper {
  position: relative;
  display: inline-block;
  flex-grow: 1;
  padding-right: 10px;
}

.talent-desc-change-button {
  position: absolute;
  bottom: -1px;
  width: 100%;
  text-align: center;
}
.talent-desc-change-button .el-button--mini {
  padding: 2px 4px 2px 8px;
  border-radius: 2px;
}

.talent-desc-change-button .el-button--warning:focus,
.talent-desc-change-button .el-button--warning:hover {
  background-color: #f49800;
  border-color: #f49800;
}

@media screen and (max-width: 700px) {
  .talent-container-wrapper {
    min-width: 350px;
  }
  .talent-container {
    width: calc(100% - 2px);
    min-width: 300px;
    margin: 0;
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
    justify-content: start;
  }

  .talent-name-wrapper span {
    padding-left: 10px;
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
    top: -3px;
    /* text-align: right; */
  }
}
</style>
