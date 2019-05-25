<template>
  <div style="min-width: 350px; margin: 0 auto; max-width: 1000px">
    <div class="basePanel">
      <class-count name="战士" :num="warriorNum" total="31"></class-count>
      <class-count name="魔导士" :num="mageNum" total="27"></class-count>
      <class-count name="骑士" :num="knightNum" total="21"/>
      <class-count name="盗贼" :num="thiefNum" total="22"></class-count>
      <class-count name="射手" :num="rangerNum" total="14"></class-count>
      <class-count name="精灵使" :num="soulWeaverNum" total="19"></class-count>
    </div>
    <p>当前数量为： {{data.length}}</p>

    <div class="filter-Wrapper">
      <filter-group
        label="职业"
        :filters="[
          {text: '戰士', value: '戰士', short:'战'}, {text: '盗贼', value: '盗贼',short:'盗'}, 
          {text: '魔導士', value: '魔導士', short:'法'},{text: '精靈師', value: '精靈師',short:'奶'},
          {text: '射手', value: '射手', short:'弓'},{text: '騎士', value: '騎士', short:'骑'}]"
        :short="short"
        @filter="resetFilter($event, 'data.base.class')"
      ></filter-group>
      <filter-group
        label="属性"
        :filters="[
          {text: '黑暗', value: '黑暗', short: '暗'},{text: '自然', value: '自然', short:'木'},
          {text: '火焰', value: '火焰', short: '火'},
          {text: '寒氣', value: '寒氣', short: '水'},{text: '光明', value: '光明', short:'光'}]"
        :short="short"
        @filter="resetFilter($event, 'data.base.element')"
      ></filter-group>
      <filter-group
        :short="short"
        label="星级"
        :filters="[{text:3, value:3, short:3},{text:4, value:4, short: 4},{text:5, value:5, short:5}]"
        @filter="resetFilter($event, 'data.base.stars')"
      ></filter-group>
      <el-button @click="enNameOpen = !enNameOpen">EnName</el-button>
    </div>
    <el-table
      :data="data"
      @cell-dblclick="editName"
      stripe
      :default-sort="{prop: 'time', order: 'descending'}"
    >
      <el-table-column prop="name" label="名字"></el-table-column>
      <el-table-column prop="name_en" label="enName" width="150px" v-if="enNameOpen">
        <template slot-scope="props">
          <el-input
            v-if="props.row.editing"
            :style="{display: props.row.editing ? ''  : 'none'}"
            v-model="props.row.data.base.name_en"
            @blur="props.row.editing=false"
            @keyup.enter.native="submitName(props.row.data)"
            ref="nameInput"
          ></el-input>
          <span :style="{display: props.row.editing ? 'none'  : ''}">{{props.row.data.base.name_en}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="time" label="修改时间" sortable width="140px"></el-table-column>
      <el-table-column prop="data.base.class" label="职业" sortable width="100px"></el-table-column>
      <el-table-column prop="data.base.element" label="属性" sortable width="100px"></el-table-column>
      <el-table-column
        prop="data.base.stars"
        label="星级"
        sortable
        :sort-orders="['descending','ascending',  null]"
        width="80px"
      ></el-table-column>
      <el-table-column prop="data.base.constellation" label="星座" width="80px"></el-table-column>
      <el-table-column type="expand" width="50px">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <template v-for="data in props.row.data.skills">
              <div :key="data.id" v-if="data.name">
                <el-form-item label="名称">
                  <span>{{ data.name }}</span>
                </el-form-item>
                <el-form-item label="CD">
                  <span>{{data.cd ? data.cd : '无'}}</span>
                </el-form-item>
                <el-form-item label="Soul">
                  <span>{{data.cd ? data.soul : '无'}}</span>
                </el-form-item>
                <el-form-item label="描述">
                  <span>{{ data.desc }}</span>
                </el-form-item>
                <el-form-item v-if="data.soulburn" label="灵魂燃烧">
                  <span>消耗： {{ props.row.data.skills.soulburn.expend }}点</span>
                  <span>效果： {{ props.row.data.skills.soulburn.desc}}</span>
                </el-form-item>
              </div>
            </template>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { postData } from './utils';
import Vue from 'vue';
import {
  // Row,
  // Col,
  Button,
  Message,
  MessageBox,
  Table,
  TableColumn,
  scrollbar,
  Form,
  FormItem,
  Input
} from 'element-ui';
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(scrollbar);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Button);
Vue.use(Input);

const ClassCount = {
  template: `<div><p>{{name}}：{{num}}个
        <span v-if="total-num">， 差{{total-num}}</span>
        </p>
      </div>`,
  props: ['name', 'num', 'total']
};

import FilterButtonGroup from './FilterButtonGroup';

export default {
  data() {
    return {
      rowData: this.serverData,
      data: this.serverData,
      thiefNum: 0,
      knightNum: 0,
      mageNum: 0,
      warriorNum: 0,
      soulWeaverNum: 0,
      rangerNum: 0,
      filterGroups: {},
      short: true,
      loadSuccess: false,
      enNameOpen: false
    };
  },
  props: {
    serverData: Array
  },
  created() {
    console.log('begin');
    this.short = window.innerWidth < 500 ? true : false;
    window.addEventListener('resize', () => {
      this.short = window.innerWidth < 500 ? true : false;
    });
  },
  mounted() {
    console.log('mounted');
    const checkNum = c => {
      return this.data.filter(hero => hero.data && hero.data.base.class === c)
        .length;
    };
    this.thiefNum = checkNum('盗贼');
    this.knightNum = checkNum('騎士');
    this.mageNum = checkNum('魔導士');
    this.warriorNum = checkNum('戰士');
    this.soulWeaverNum = checkNum('精靈師');
    this.rangerNum = checkNum('射手');
    this.loadSuccess = true;
    console.log('load Data');
  },
  components: { 'class-count': ClassCount, 'filter-group': FilterButtonGroup },
  methods: {
    editName(row, column, cell) {
      if (column.property !== 'name_en') return;
      console.log(row.editing);
      this.$set(row, 'editing', true);
      // row.editing = true;
      this.$nextTick(() => {
        cell.querySelector('input').focus();
      });
      // setTimeout(() => {
      // }, 1000);
    },
    submitName(data) {
      // console.log(data);
      this.$refs.nameInput.blur();
      // if (this.submiting) return;
      // this.submiting = true;
      const h = this.$createElement,
        self = this;
      MessageBox.confirm(`${data.base.name_en}`, '确认英文名', {
        // message: h("p", { style: "color: #67C23A" }, data.base.name_en),
        // showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => postData(data))
        .then(option => Message(option))
        .catch(err => {
          Message({
            type: 'info',
            message: err
          });
        });
    },
    handleEdit(index, row) {
      console.log(row.url);
      this.$vlf.setItem('dataUrl', row.url);
      this.$router.push('/EditPanel/' + row.name);
    },
    filter(group, p, reset) {
      let targetData = !reset ? this.data : this.rowData;
      if (group.length === 0) {
        this.data = targetData;
        return;
      }

      this.filterGroups[p] = group;
      const property = p.split('.');
      let tempArr = [];
      for (let i in group) {
        let arr = targetData.filter(key => {
          const target = change(key, property);
          return target === group[i].value;
        });
        tempArr = tempArr.concat(arr);
      }
      this.data = tempArr;

      function change(target, arr) {
        let i = 0;
        return re();
        function re() {
          if (!target) return;
          target = target[arr[i++]];
          if (i < arr.length) {
            return re(target, arr);
          } else {
            return target;
          }
        }
      }
    },
    resetFilter(group, p) {
      this.filterGroups[p] = group;
      let first = true;
      for (let key of Object.keys(this.filterGroups)) {
        if (first) {
          first = false;
          this.filter(this.filterGroups[key], key, true);
        } else {
          this.filter(this.filterGroups[key], key);
        }
      }
    }
  }
};

class TaskQueue {
  constructor(concurrency) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }

  pushTask(task) {
    this.queue.push(task);
    this.next();
  }

  next() {
    while (this.running < this.concurrency && this.queue.length) {
      const task = this.queue.shift();
      task().then(() => {
        this.running--;
        this.next();
      });
      this.running++;
    }
  }
}
</script>
<style scoped>
.basePanel {
  display: flex;
  flex-wrap: wrap;
  max-width: 1000px;
}
.basePanel div {
  margin: 10px;
  width: 150px;
}

.filter {
  margin-left: 10px;
  text-align: center;
}
.filter-title {
  margin-right: 10px;
  font-size: 100%;
  padding-top: 5px;
}
</style>
