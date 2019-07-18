<template>
  <div v-if="skills.length > 0" class="skill-container--inner-wrapper">
    <div class="skill-container" v-for="(skill, index) in unlockCond" :key="skill.name">
      <div class="skill-title">
        <div class="skill-pic-container-wrapper">
          <skill-container :skill="skills[index]"></skill-container>
        </div>
        <div class="skill-tiltle-part">
          <div class="skill-title-text">
            <span>所需材料：</span>
          </div>
          <div class="skill-lvUpCost-wrapper">
            <!-- 改成根据slevelcompute返回当前数据 -->
            <div
              v-for="(skill, index) in picList[index]"
              :key="index"
              class="item-viwer-flex-default"
            >
              <item-viewer :short="!short" :item="skill.item" :num="skill.count"></item-viewer>
            </div>
          </div>
        </div>
      </div>

      <div class="skill-control-container">
        <div class="skill-status">
          需要：
          <span>
            精英
            <span
              :style="skill.data[sLevel[index]].unlockCond.phase > 0 ?  'color: #f49800' : ''"
            >{{skill.data[sLevel[index]].unlockCond.phase}}</span>
            /
            <span>{{skill.data[sLevel[index]].unlockCond.level}}</span>
          </span>
        </div>
        <div>
          <span class="skill-title-level">
            LV
            <span>{{sLevel[index] + 1}}</span>
            <i class="el-icon-right"></i>
            <span>{{sLevel[index] + 2}}</span>
            <span></span>
          </span>
          <el-button icon="el-icon-minus" size="mini" circle @click="sLevelAdd(index, -1)"></el-button>
          <el-button circle icon="el-icon-plus" size="mini" @click="sLevelAdd(index, 1)"></el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { path, fetchGet, itemBackground } from "../utils";
import ItemViewer from "../ItemViewer";
import SkillContainer from "./SkillContainer";

export default {
  components: {
    "item-viewer": ItemViewer,
    "skill-container": SkillContainer
  },
  props: {
    skills: {
      required: true
    },
    allLevelCost: {
      required: true
    },
    seven: Array,
    short: Boolean
  },
  mounted() {
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
          data: [...this.allLevelCost, ...this.seven[i].levelUpCostCond]
        });
      }
      return res;
    }
  },
  methods: {
    itemBackground(rarity) {
      return itemBackground[rarity];
    },
    sLevelAdd(index, i) {
      let num = this.sLevel[index] + i;
      if (num > this.unlockCond[index].data.length - 1)
        num = this.unlockCond[index].data.length - 1;
      if (num < 0) num = 0;
      let p = num < 6 ? "lvlUpCost" : "levelUpCost";
      // this.$set(this.picList[index], 'load', false);

      Promise.all(
        this.unlockCond[index].data[num][p].map(async p => {
          const item = await fetchGet(path + "item/data/" + p.id + ".json");
          const res = {
            item: item,
            count: p.count
          };
          return res;
        })
      ).then(arr => {
        if (p === "lvlUpCost") {
          this.picList = [arr, arr, arr];
          this.sLevel = [num, num, num];
        } else {
          this.$set(this.picList, index, arr);
          this.$set(this.sLevel, index, num);
        }
      });
    }
  }
};
</script>

<style scoped>
.skill-container--inner-wrapper {
  margin-top: 30px;
}
/* part 4 */

.group-container-title {
  font-weight: bold;
  color: white;
  margin-bottom: 20px;
  background-color: #414141;
  padding-left: 1vw;
}

.skill-lvUpCost-wrapper {
  display: flex;
  align-items: center;
  flex-basis: 80px;
}
.item-viwer-flex-default {
  min-width: 100px;
}

.skill-container {
  padding-bottom: 10px;
  position: relative;
  /* height: 140px; */
  display: flex;
  margin: 20px 0 0 0;
  align-items: stretch;
}

.skill-container + .skill-container {
  border-top: 1px solid rgb(235, 238, 245);
  padding-top: 30px;
}

.skill-title {
  position: relative;
  display: flex;
  /* align-items: center; */
  justify-content: start;
  padding: 0 5px;
  width: calc(70% - 10px);
  min-height: 123px;
  border-right: 1px solid rgba(158, 158, 158, 0.4);
}

.skill-tiltle-part {
  padding-left: 20px;
  width: calc(70% - 100px);
}
.skill-title-level {
  display: inline-block;
  left: 0;
  padding-right: 2vw;
}
.skill-control-container {
  text-align: right;
  width: 30%;
  padding-right: 20px;
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

.skill-status,
.skill-status + div {
  height: 50%;
}

.skill-status-desc {
  font-size: 16px;
  color: #606266;
}
.skill-status span + span {
  padding-right: 5px;
}

.evolvcost-item-count {
  text-align: center;
  font-size: 15px;
}

.skill-title-text {
  padding-bottom: 20px;
}

@media screen and (max-width: 700px) {
  .skill-container--inner-wrapper {
    margin-bottom: 30px;
  }
  .item-viwer-flex-default {
    min-width: 80px;
  }
  .skill-lvUpCost-wrapper {
    flex-basis: 70px;
  }
  .skill-container {
    display: block;
  }
  .skill-status {
    font-size: calc(12px + 0.7vw);
    display: inline;
  }
  .skill-status + div {
    font-size: calc(12px + 0.7vw);
    display: inline;
  }
  .skill-status-desc {
    font-size: calc(13px + 0.5vw);
  }
  .talents-effects-desc {
    font-size: calc(12px + 0.5vw);
  }
  .skill-title {
    margin-top: 15px;
    border: none;
  }
  .skill-title-level {
    display: inline-block;
    padding-left: 10vw;
    padding-right: 2vw;
  }
  .skill-tiltle-part {
    flex-wrap: wrap;
    padding-left: 5vw;
    width: calc(100% - 100px);
    border: none;
  }
  .skill-control-container {
    text-align: left;
    padding-top: 10px;
    width: auto;
  }
  .skill-container {
    margin-top: 10px;
    padding-bottom: 0px;
    height: 160px;
  }

  .skill-container + .skill-container {
    padding: 10px 0;
  }

  .skill-range-button {
    position: absolute;
    bottom: -25px;
    z-index: 1;
  }
  .skill-pic-contianer {
    width: calc(65px + 1vw);
    height: calc(65px + 1vw);
  }
  .skill-name-wrapper {
    font-size: calc(12px + 0.1vw);
  }

  .group-container-title {
    margin-bottom: 5px;
  }

  .evolvcost-item-count {
    font-size: calc(12px + 0.5vw);
  }

  .skill-title-text {
    font-size: calc(13px + 0.5vw);
    padding-bottom: 5px;
  }
}
</style>
