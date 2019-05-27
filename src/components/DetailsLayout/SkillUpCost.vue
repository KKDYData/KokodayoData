<template>
  <div v-if="skills.length > 0" class="skill-container-wrapper">
    <div class="group-container-title">技能升级消耗</div>
    <div class="skill-container" v-for="(skill, index) in unlockCond" :key="skill.name">
      <div class="skill-title">
        <div class="skill-pic-contianer">
          <el-image style="height:100%" :src="getSkillPath(skill.Id)" lazy>
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <div class="skill-name-wrapper">
            <span>{{skills[index].levels[0].name}}</span>
          </div>
        </div>
        <div class="skill-tiltle-part">
          <div class="skill-tiltle-part">
            <div class="skill-status">
              <span>
                需求精英
                <span>{{skill.data[sLevel[index]].unlockCond.phase}}</span>
                /
                <span>{{skill.data[sLevel[index]].unlockCond.level}}</span>
              </span>
            </div>
          </div>
          <div class="skill-lvUpCost-wrapper">
            <!-- 改成根据slevelcompute返回当前数据 -->
            <div
              class="evolvcost-item-contianer"
              v-for="(item) in picList[index]"
              :key="item.IconId"
            >
              <div style="text-align: center">
                <el-image style="width: 50px" :src="itemPic(item.item.iconId)">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
                <div class="text-align: center;">
                  <span>X</span>
                  <span>{{item.count}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="skill-name-level">
        <span class="skill-title-level">
          LV
          <span>{{sLevel[index] + 1}}</span>
          <i class="el-icon-right"></i>LV
          <span>{{sLevel[index] + 2}}</span>
          <span></span>
        </span>
        <el-button icon="el-icon-minus" size="mini" circle @click="sLevelAdd(index, -1)"></el-button>
        <el-button circle icon="el-icon-plus" size="mini" @click="sLevelAdd(index, 1)"></el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { path, fetchGet } from '../utils';

export default {
  props: {
    skills: {
      required: true
    },
    allLevelCost: {
      required: true
    },
    seven: {}
  },
  mounted() {
    console.log(this.unlockCond);
    for (let i = 0; i < this.unlockCond.length; i++) {
      this.sLevelAdd(i, 0);
    }
  },
  data() {
    return {
      sLevel: [0, 0, 0],
      picList: { 0: [], 1: [], 2: [] }
    };
  },
  computed: {
    unlockCond() {
      const res = [];
      for (let i = 0; i < this.skills.length; i++) {
        res.push({
          Id: this.skills[i],
          data: [...this.allLevelCost, ...this.seven[0].levelUpCostCond]
        });
      }
      console.log(res);
      return res;
    }
  },
  methods: {
    itemPic(id) {
      // console.log(id);
      return path + 'item/pic/' + id + '.png';
    },
    sLevelAdd(index, i) {
      let num = this.sLevel[index] + i;
      if (num > this.unlockCond[index].data.length - 1)
        num = this.unlockCond[index].data.length - 1;
      if (num < 0) num = 0;
      this.$set(this.sLevel, index, num);
      let p = num < 6 ? 'lvlUpCost' : 'levelUpCost';
      this.$set(this.picList[index], 'load', false);
      console.log(num);
      Promise.all(
        this.unlockCond[index].data[num][p].map(async p => {
          const item = await fetchGet(path + 'item/data/' + p.id + '.json');
          const res = {
            item: item,
            count: p.count
          };
          return res;
        })
      ).then(arr => {
        console.log(arr);
        this.$set(this.picList, index, arr);
      });
    },
    getSkillPath(skill) {
      const name = skill.iconId ? skill.iconId : skill.skillId;
      return path + 'skills/pics/skill_icon_' + name + '.png';
    },
    async getItemId(id) {}
  }
};
</script>

<style scoped>
/* part 4 */

.skill-lvUpCost-wrapper {
  display: flex;
  align-items: center;
}

.skill-container {
  border-bottom: 1px solid rgb(235, 238, 245);
  padding-bottom: 30px;
  position: relative;
  height: 140px;
}
.group-container-title {
  border-bottom: 1px solid rgb(235, 238, 245);
  font-weight: bold;
  color: white;
  margin-bottom: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  padding-left: 1vw;
}
.skill-title {
  position: relative;
  display: flex;
  align-items: stretch;
  margin-top: 20px;
  justify-content: start;
  padding: 0 5px;
  width: calc(100% - 10px);
}

.skill-tiltle-part {
  padding-left: 20px;
  width: auto;
}
.skill-title-level {
  display: inline-block;
  left: 0;
  padding-right: 2vw;
}
.skill-name-level {
  position: absolute;
  margin-top: 2vw;
  margin-bottom: 2vw;
  right: 0px;
  bottom: 10px;
}
.skill-pic-contianer {
  flex-shrink: 0.5;
  width: 100px;
  height: 100px;
  position: relative;
  vertical-align: middle;
}
.skill-name-wrapper {
  text-align: center;
}

.skill-status {
  font-size: 14px;
}
.skill-status-desc {
  font-size: 16px;
  color: #606266;
}
.skill-status span + span {
  padding-right: 5px;
}

@media screen and (max-width: 700px) {
  .skill-status {
    font-size: calc(12px + 0.5vw);
  }
  .skill-status-desc {
    font-size: calc(13px + 0.5vw);
  }
  .talents-effects-desc {
    font-size: calc(12px + 0.5vw);
  }
  .skill-title-level {
    display: inline-block;
    padding-left: 35vw;
    padding-right: 2vw;
  }
  .skill-tiltle-part {
    flex-wrap: wrap;
    padding-left: 2vw;
    width: calc(100% - 100px);
    border: none;
  }
  .skill-name-level {
    position: absolute;
    right: 20px;
    bottom: 0px;
  }
  .skill-container {
    padding-bottom: 0px;
  }
  .skill-range-button {
    position: absolute;
    bottom: -25px;
    z-index: 1;
  }
  .skill-pic-contianer {
    width: calc(70px + 1vw);
    height: calc(70px + 1vw);
  }
  .skill-name-wrapper {
    font-size: calc(12px + 0.1vw);
  }
}
</style>
