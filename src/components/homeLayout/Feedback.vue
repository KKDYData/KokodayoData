<template>
  <div style="padding: 0 20px">
    <div class="feedback-part">
      <my-title title="反馈"></my-title>
      <div class="feedback-info-wrapper">
        <el-button @click="submitFb" type="primary" class="feedback-button">提交</el-button>
        <el-button
          @click="feedback = ''"
          icon="el-icon-delete"
          circle
          class="feedback-button"
          plain
        ></el-button>
        <input-wrapper style="width: 50%" title="ID">
          <template>
            <el-input v-model="id" placeholder="用于识别的ID"></el-input>
          </template>
        </input-wrapper>
      </div>
      <input-wrapper title="反馈">
        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="feedback"></el-input>
      </input-wrapper>
    </div>
    <div class="feedback-part">
      <my-title title="说明"></my-title>
      <p>1.选了标签（公招）的Tag之后，筛选模式会发生变化</p>
      <p>2.【职业】、【星级】这些分类名，点击可以取消全部选择。</p>
      <p>3.语音√，立绘√，皮肤×，地图信息√，敌人信息√，每波敌人×，弩炮台数据×，路线×， 整合企鹅物流的掉落信息×</p>
      <p>4.可能夏活前会完全搞定吧。</p>
      <p>5.群799872783！</p>
    </div>
  </div>
</template>

<script>
import { Input, Button, Message, MessageBox } from 'element-ui';
import Vue from 'vue';
Vue.use(Input);
Vue.use(Button);
import InputWrapper from './InputWrapper';
import MyTitle from '../MyTitle';

import { submitFeedback } from '../../utils';

export default {
  components: {
    InputWrapper,
    MyTitle
  },
  props: {
    store: {
      required: true
    }
  },
  data() {
    return {
      feedback: '',
      id: '',
      debounceLogFb: null
    };
  },
  watch: {
    feedback() {
      clearTimeout(this.debounceLogFb);
      this.debounceLogFb = setTimeout(async () => {
        await this.store.setItem('tempFeedback', this.feedback);
        console.log('save success');
      }, 1000);
    }
  },
  async mounted() {
    const lastFeedback = await this.store.getItem('tempFeedback');
    const lastFeedbackID = await this.store.getItem('feedbackID');
    if (lastFeedback) {
      this.feedback = lastFeedback;
      Message.success('成功恢复上次反馈但未提交的内容');
    }
    if (lastFeedbackID) {
      this.id = lastFeedbackID;
    }
  },
  methods: {
    async submitFb() {
      if (!this.id) {
        Message.warning('必须填ID');
        return;
      }
      if (!/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/.test(this.id)) {
        Message.warning('ID不能包含特殊符号');
        return;
      }
      if (!this.feedback) {
        Message.warning('反馈内容不能为空');
        return;
      }
      const lastId = await this.store.getItem('feedbackID');
      if (!lastId) {
        await this.store.setItem('feedbackID', this.id);
      }
      if (lastId && lastId !== this.id) {
        await MessageBox.confirm(
          `这次的ID(${this.id})和上次不一样，需要换成上次(${lastId})的吗？`,
          'ID不一致'
        )
          .then(el => {
            this.id = lastId;
          })
          .catch(el => {
            this.store.setItem('feedbackID', this.id);
          });
      }
      MessageBox.confirm(
        `内容: ${this.feedback}`,
        `确认提交内容, ID: ${this.id}`
      )
        .then(el => {
          this.submit();
        })
        .catch(el => {
          Message.info('取消');
        });
    },
    submit() {
      const data = { id: this.id, content: this.feedback };
      return submitFeedback(data)
        .catch(err => {
          console.error(err);
        })
        .then(res => {
          Message.success('反馈成功，感谢你的支持');
        });
    }
  }
};
</script>

<style lang="stylus" scoped>
.feedback-part {
  margin: 20px 0;
}

.feedback-button {
  float: right;
}

.feedback-button+.feedback-button {
  margin-right: 10px;
}
</style>


