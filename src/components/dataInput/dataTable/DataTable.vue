<template>
  <!-- 数据表单 -->
  <el-tabs v-model="activeName">
    <StarChose :star="dataPartOne.stars" v-if="starPanel" @change="changeStar($event)"></StarChose>
    <!-- form1 -->
    <el-tab-pane label="基础描述" name="first">
      <el-form ref="form" :model="dataPartOne" label-width="60px">
        <!-- 基础属性折叠板 -->
        <!-- 基础属性折叠板——基础 -->
        <div class="basePanel">
          <el-form-item label="名字">
            <el-input @change="changeName" v-model="dataPartOne.name"></el-input>
          </el-form-item>

          <el-form-item label="星">
            <el-select v-model="dataPartOne.stars">
              <el-option v-for="num in [3, 4, 5]" :key="num" :value="num"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="星座">
            <el-select v-model="dataPartOne.constellation">
              <el-option
                v-for="item in baseData.constellation"
                :key="item"
                :value="item"
                :label="item"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="职业">
            <el-select v-model="dataPartOne.class">
              <el-option v-for="item in baseData.class" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="属性">
            <el-select v-model="dataPartOne.element">
              <el-option v-for="item in baseData.element" :key="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="简介">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 7}"
            v-model="dataPartOne.intro"
          ></el-input>
        </el-form-item>
      </el-form>
    </el-tab-pane>

    <el-tab-pane label="数值" name="second">
      <!-- form2 -->
      <el-form>
        <!-- <el-form-item label="介绍">
          <el-input v-model="data.intro"></el-input>
        </el-form-item>-->
        <!-- 基础属性折叠板——数值 -->
        <div class="basePanel">
          <el-form-item
            v-for="item in baseData.stats"
            :key="item.id"
            :label="item.name"
            :prop="item.id"
            label-width="80px"
          >
            <el-input v-model.number="dataPartTwo[item.id]"></el-input>
          </el-form-item>
          <!-- 图片入口1 -->
          <slot name="statspic"></slot>
        </div>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="任务和背景" name="third">
      <!-- form3 -->
      <!-- 基础属性折叠板——任务 -->
      <el-form :model="dataPartThree">
        <div class="basePanel">
          <el-form-item
            v-for="item in baseData.missionStats"
            :key="item.id"
            :label="item.name"
            :prop="item.id"
            label-width="80px"
          >
            <el-input v-model.number="dataPartThree[item.id]"></el-input>
          </el-form-item>
          <el-form-item label="名称" label-width="80px">
            <el-input v-model="dataPartThree.missionName"></el-input>
          </el-form-item>
          <el-form-item label="描述" label-width="80px" style="flex-grow:1">
            <el-input
              :autosize="{ minRows: 2, maxRows: 7}"
              type="textarea"
              v-model="dataPartThree.missionDesc"
            ></el-input>
          </el-form-item>

          <slot name="missionStats"></slot>
        </div>
        <el-form-item label="故事背景" label-width="80px">
          <el-input
            :autosize="{ minRows: 4, maxRows: 7}"
            type="textarea"
            v-model="dataPartThree.background"
          ></el-input>
        </el-form-item>
      </el-form>
    </el-tab-pane>

    <el-tab-pane label="技能" name="fourth">
      <!-- fomr4 -->
      <el-tabs v-model="activeSkillName">
        <template v-for="(skill) in dataPartFour">
          <el-tab-pane :label="'技能' + (skill.id + 1)" :name="'skill'+ skill.id" :key="skill.id">
            <el-form :model="skill" :key="skill.id" label-width="80px">
              <div class="basePanel">
                <el-form-item label="技能名">
                  <el-input v-model="skill.name"></el-input>
                </el-form-item>
                <el-form-item label="cd" label-width="80px">
                  <el-input size="mini" v-model="skill.cd" width="80px"></el-input>
                </el-form-item>
                <el-form-item label="Soul" label-width="80px">
                  <el-input size="mini" v-model="skill.soul"></el-input>
                </el-form-item>
                <el-form-item label="灵魂燃烧" label-width="80px">
                  <el-switch
                    @input="clearSoulBurn($event, skill.id)"
                    v-model="skill.soulburn"
                    :disabled="sbDisabled[skill.id]"
                  ></el-switch>
                </el-form-item>
              </div>
              <el-row style="margin-bottom: 0">
                <el-col :span="16">
                  <el-form-item label="描述">
                    <el-input
                      v-model="skill.desc"
                      type="textarea"
                      :autosize="{ minRows: 6, maxRows: 20}"
                    ></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <div class="skill-pic">
                    <slot :name="'skill-' + skill.id"></slot>
                  </div>
                </el-col>
              </el-row>

              <template v-if="skill.soulburn">
                <el-form-item label="强化效果">
                  <el-select v-model="soulburn.expend">
                    <el-option v-for="num in [10, 20]" :key="num" :value="num" :label="num"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="描述">
                  <el-input v-model="soulburn.desc"></el-input>
                </el-form-item>
              </template>
              <div class="update-title-wrapper">
                <div class="update-title">升级效果</div>
                <el-button @click="skill.update.push('')" circle class="el-icon-plus" size="mini"></el-button>
                <el-button
                  @click="dragDisabled = !dragDisabled"
                  :type="dragDisabled ? '' : 'success'"
                  class="el-icon-sort"
                  size="mini"
                  circle
                ></el-button>
              </div>
              <div class="update-container">
                <draggable
                  :disabled="dragDisabled"
                  :list="skill.update"
                  @start="dragging = true"
                  @end="dragging = false"
                  style="width: calc(100% - 60px) "
                >
                  <template v-for="(item, index) in skill.update">
                    <el-form-item
                      style="margin-left: 40px"
                      :key="index"
                      :label="'+ ' + (index+ 1)"
                      label-width="40px"
                    >
                      <div>
                        <el-input v-model="skill.update[index]"></el-input>
                      </div>
                      <!-- @tap="skill.update.splice(index, 1)" -->
                    </el-form-item>
                  </template>
                </draggable>
                <div v-if="!dragDisabled" class="delete-group">
                  <el-button
                    v-for="(item, index) in skill.update"
                    :key="index"
                    style="z-index:9999"
                    @click.stop="skill.update.splice(index, 1)"
                    circle
                    class="el-icon-delete update-delete"
                  ></el-button>
                </div>
              </div>
            </el-form>
          </el-tab-pane>
        </template>
      </el-tabs>
    </el-tab-pane>
    <div class="uplaodWrapper">
      <el-button type="primary" @click="submitForm('form')">
        上传数据
        <i class="el-icon-upload el-icon--right"></i>
      </el-button>
    </div>
  </el-tabs>
</template>

<script>
// import testData from "./testData.js";
import heroBaseData from "./heroBaseData";
import StarChose from "./StarChose";

// console.log(heroBaseData);
import {
  Input,
  Select,
  Switch,
  Form,
  FormItem,
  Option,
  Collapse,
  CollapseItem,
  Tabs,
  TabPane,
  Message
} from "element-ui";
import draggable from "vuedraggable";
import Vue from "vue";
Vue.use(Input);
Vue.use(Select);
Vue.use(Switch);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Option);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(TabPane);
Vue.use(Tabs);

const statsRules = (data, str) => {
  const arr = {};
  console.log(str);
  for (let t of data[str]) {
    arr[t.id] = [
      { type: "number", message: "必须为数字值", trigger: "blur" },
      { required: true, message: "不能为空", trigger: "blur" }
    ];
  }
  console.log(arr);
  return arr;
};
const skillRules = () => {
  const skillObj = {},
    skillArr = [];

  for (let i = 0; i < 3; i++) {
    skillArr.push("skill" + i + "name");
    skillArr.push("skill" + i + "description");
  }
  for (let d of skillArr) {
    skillObj[d] = [{ required: true, message: "不能为空", trigger: "blur" }];
  }
  return skillObj;
};

const strRules = () => {
  const strs = [
      "name",
      "constellation",
      "class",
      "element",
      "intro",
      "missionName",
      "missisonDescription",
      "background"
    ],
    strObj = {};
  for (let t of strs) {
    strObj[t] = [{ required: true, message: "不能为空", trigger: "change" }];
  }
  return strObj;
};
const statsArr = [];
export default {
  components: {
    draggable,
    StarChose
  },
  data() {
    return {
      starPanel: false,
      activeName: "first",
      activeSkillName: "skill1",
      baseData: heroBaseData,
      dragDisabled: true,
      dataPartOne: {
        name: "",
        stars: 5,
        class: "",
        element: "",
        intro: ""
      },
      dataPartTwo: {
        CP: 0,
        attack: 0,
        health: 0,
        speed: 0,
        defense: 0,
        criticalHitChance: 0,
        criticalHitDamage: 0,
        effectiveness: 0,
        effectResistance: 0
      },
      dataPartThree: {
        missionName: "",
        missionDesc: "",
        command: 0,
        charm: 0,
        politics: 0,
        background: ""
      },
      dataPartFour: {
        0: {
          id: 0,
          name: "",
          desc: "",
          soulburn: false,
          cd: 0,
          soul: 0,
          update: []
        },
        1: {
          id: 1,
          name: "",
          desc: "",
          soulburn: false,

          cd: 0,
          soul: 0,
          update: []
        },
        2: {
          id: 2,
          name: "",
          desc: "",
          soulburn: false,
          cd: 0,
          soul: 0,
          update: []
        }
      },
      soulburn: { id: 0, expend: 10, desc: "" },

      sbDisabled: [false, false, false]
    };
  },
  props: {},
  mounted() {
    console.log(this.data);
  },
  computed: {},
  methods: {
    deleteUpdate() {
      console.log("????????????");
    },
    changeName() {
      this.$emit("changeName", this.dataPartOne.name);
    },

    saveDataInLocal() {
      const data = {
        base: this.dataPartOne,
        details: this.dataPartThree,
        stats: this.dataPartTwo,
        skills: { ...this.dataPartFour, soulburn: this.soulburn }
      };
      this.$vlf.setItem("heroData", data);
      localStorage.setItem("heroData", JSON.stringify(data));
    },
    async loadLocalData() {
      // const dataStr = localStorage.getItem("heroData");
      const data = await this.$vlf.getItem("heroData");
      if (!data) return;
      this.loadData(data)
        .then(() => {
          Message({
            type: "info",
            message: "读取缓存数据成功"
          });
        })
        .catch(err => {
          Message({
            type: "error",
            message: "读取缓存数据异常: " + err
          });
        });
    },
    loadData(data) {
      return new Promise((resolve, reject) => {
        try {
          this.dataPartOne = data.base;
          this.dataPartTwo = data.stats;
          this.dataPartThree = data.details;
          this.dataPartFour = {
            0: data.skills[0],
            1: data.skills[1],
            2: data.skills[2]
          };
          this.soulburn = data.skills.soulburn;
        } catch (error) {
          console.log(error);
          reject(error);
          return;
        }
        console.log("读取数据成功");
        resolve();
      });
    },

    async submitForm(formName) {
      this.starPanel = true;
      // return;
      await new Promise(resolve => {
        this.starResovle = resolve;
      });
      let check = true,
        soulburn,
        skill = this.dataPartFour;
      //检测soulburn
      for (let sk of Object.values(skill)) {
        console.log(sk);
        if (sk.soulburn) soulburn = true;
      }
      if (!soulburn) {
        Message({
          type: "error",
          message: "还没选灵魂燃烧"
        });
        return;
      }

      const checkData = data => {
        console.log(data);
        for (const [key, value] of Object.entries(data)) {
          if (value === "" || value === 0 || value === undefined) {
            console.log("key: " + key);
            Message({
              type: "error",
              message: "任务和背景还没录" + key + "  现在为  " + value
            });
            check = false;
            return;
          }
          if (value && Object.keys(value).length > 1) {
            checkData(value);
          }
        }
      };
      const checkSkill = data => {
        let i = 1;
        for (const [key, value] of Object.entries(data)) {
          // console.log("key: " + key);
          // console.log(value);
          if (key === "rate") continue;

          if (value === "") {
            Message({
              type: "error",
              message: "技能" + i++ + "还没录" + key
            });
            check = false;
            return;
          }
          if (value && Object.keys(value).length > 1) {
            console.log("_______________________key" + key);
            console.log(value);
            checkSkill(value);
          }
        }
      };
      checkData(this.dataPartThree);
      checkSkill(this.dataPartFour);
      if (!check) return;
      const data = {
        base: this.dataPartOne,
        details: this.dataPartThree,
        stats: this.dataPartTwo,
        skills: { ...this.dataPartFour, soulburn: this.soulburn }
      };

      this.$emit("uploadData", data);
    },
    changeStar(e) {
      this.dataPartOne.stars = e;
      this.starPanel = false;
      this.starResovle && this.starResovle();
    },
    clearSoulBurnArr(i, sbDisabled) {
      console.log("?????????");
      const skill = this.dataPartFour,
        arr = [0, 1, 2];
      if (skill[i].soulburn.true) {
        arr.splice(i, 1);
        for (let i = 0; i++; i < arr.length) {
          sbDisabled[i] = true;
        }
      }
    },
    clearSoulBurn(state, id) {
      // console.log(state);
      // this.dataPartFour["soulburn" + 1].soulburn = null;
      console.log("match" + id);
      if (!this.nowChose) {
        Message({
          type: "error",
          message: "还没选技能"
        });
        this.dataPartFour[id].soulburn = false;
        return;
      }
      let t = this.nowChose.match(id + 1) === null;
      if (t) {
        Message({
          type: "error",
          message: "你现在扫的图和你要识别的灵魂燃烧所在的图不是一样的"
        });
        this.dataPartFour[id].soulburn = false;
        return;
      }
      if (state) {
        this.$emit("checkSoulBurn", id);
      }
      let i = 0; //循环次数
      while (i < 2) {
        id++ < 2 ? "" : (id = 0);
        this.sbDisabled[id] = state;
        i++;
      }
    }
  }
};
</script>
<style lang="stylus" scoped>
.uplaodWrapper {
  display: flex;
  justify-content: center;
}

.skill-pic {
  width: 15vw;
  height: 15vw;
  margin-left: 50px;
}

@media screen and (min-width: 400px) and (max-width: 700px) {
  .skill-pic {
    margin-left: 15px;
  }
}

.update-container {
  display: flex;
}

.update-delete {
  // position: absolute;
  // right: -50px;
  // top: 0;
  display: block;
  margin-bottom: 22px;
  margin-left: 10px;
}

.update-title-wrapper {
  margin-bottom: 10px;
  overflow: hidden;
  display: flex;
  align-items: center;

  .update-title {
    text-align: right;
    float: left;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 80px;
  }
}

.basePanel {
  display: flex;
  flex-wrap: wrap;
}
</style>
