<template>
  <div class="tttt">
    <div class="talent-container-wrapper">
      <div v-for="(item, index) in talents" :key="item.name" class="talent-container">
        <div class="talent-name-wrapper">
          <span
            :style="!short && item.name && item.name.length > 5 ? 'font-size: 13px': ''"
          >{{ item.name }}</span>
          <div class="talent-desc-change-button">
            <el-button
              v-if="item.condidate[0].potentailUP"
              size="mini"
              :type="!showTalentPotentailUP[index] ? 'info' : 'warning'"
              @click="openTalentPotentailUP(index)"
            >
              潜能提升
              <i
                :class="!showTalentPotentailUP[index] ? 'el-icon-star-off' : 'el-icon-star-on'"
              />
            </el-button>
          </div>
        </div>
        <div
          v-for="talent in item.condidate"
          :key="talent.description"
          class="talent-desc-container"
        >
          <div class="talent-condition-wrapper">
            <span>精英{{ talent.unlockCondition.phase }}/{{ talent.unlockCondition.level }}级</span>
          </div>

          <div class="talent-desc-content-wrapper">
            <div v-if="!showTalentPotentailUP[index]" class="talent-desc-content">
              <span v-html="talent.description" />
            </div>
            <div v-else class="talent-desc-content">
              <span v-html="talent.potentailUP.description" />
              <span>(需要潜能{{ talent.potentailUP.requiredPotentialRank + 1 }}级)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    talents: {
      required: true
    },
  },
  data() {
    return {
      showTalentPotentailUP: [false, false, false]
    }
  },
  computed: {
    ...mapState(['short']),
  },
  methods: {
    openTalentPotentailUP(t) {
      this.$set(this.showTalentPotentailUP, t, !this.showTalentPotentailUP[t])
      this.$emit('talentPotentailUp', this.showTalentPotentailUP)
    }
  }
}
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

.talent-container-wrapper {
  display: flex;
  position: relative;
  justify-content: space-between;
  flex-wrap: wrap;
  min-width: 700px;
}

.talent-container {
  width: 45%;
  min-width: 350px;
  margin: 10px 0;
  position: relative;
}

/* 天赋名字 */
.talent-name-wrapper {
  border-bottom: 1px solid #818181;
  padding-bottom: 3px;
  margin-bottom: 10px;
  width: 70%;
}

/* 天赋内容 */
.talent-desc-container {
  padding: 5px;
  position: relative;
  min-width: 250px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  align-content: center;
}

.talent-condition-wrapper {
  margin-right: 10px;
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
  margin-left: 10px;
  display: inline;
  vertical-align: bottom;
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
    width: 100%;
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
    width: 80%;
    border-right: none;
    border-bottom: 1px solid rgba(158, 158, 158, 0.4);
    justify-content: start;
    box-sizing: border-box;
  }

  .talent-name-wrapper span {
    padding-left: 10px;
  }

  /* 天赋内容 */
  .talent-desc-container {
    width: 100%;
    margin-left: 0px;
    flex-wrap: wrap;
    margin-top: 10px;
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
}
</style>
