<template>
  <div style="padding: 0 20px">
    <el-link
      style="vertical-align: baseline;"
      href="https://somedata.top/ArknightsBeta"
      type="info"
    >Beta版链接</el-link>
    <div class="feedback-part">
      <my-title title="反馈"></my-title>
      <div class="feedback-info-wrapper">
        <input-wrapper style="width: 50%" title="ID">
          <template>
            <el-input v-model="id" placeholder="用于识别的ID"></el-input>
          </template>
        </input-wrapper>
        <div class="feedback-button">
          <el-button @click="feedback = ''" icon="el-icon-delete" circle plain></el-button>
          <el-button @click="submitFb" type="primary">提交</el-button>
        </div>
      </div>
      <input-wrapper title="反馈">
        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="feedback"></el-input>
      </input-wrapper>
    </div>
    <div class="feedback-part">
      <my-slide-title :short="short" title="v0.7 更新内容">
        <div>
          <h4>1. 敌人图鉴 → 更名为关卡数据</h4>
          <p>(1)补全了除了训练关卡的数据</p>
          <p>(2)能正确显示关卡中被重写的敌人的数据了</p>
          <p>(3)增加了显示敌人路线的功能</p>
          <p>(4)显示敌人路线的模式，同时计算了每波敌人出现的时间，同一波次的敌人同时出发，但有不同的延迟时间，也就是单个敌人的出发时间是当前波次出发时间+延迟时间。</p>
          <p>(5)整合了企鹅物流的掉落数据，因为活动开了缓存所以10分钟，手动刷新可以更新数据。一般情况下，例如在角色图鉴中，会显示材料的主要统计概率、多少体力出一个，在关卡数据中，可以在材料掉落的概率掉落一栏中，看到材料在该关卡的统计掉率。</p>
          <p>(5)增加了地图预设数据的展示，例如弩炮台、预设的道具卡(箱子)角色(1-11)预摆的干员(1-11)</p>
          <p>(*)可能下周加入一个摆箱子的功能(只要我想好了UI交互怎么弄，实现起来不难)</p>
          <h4>2. 干员图鉴</h4>
          <p>(1)修复了筛选的一些BUG</p>
          <p>(2)现在可以计算干员任意等级下的数据了，因为前面做了地图预设的数据计算，所以就有函数可以扔去干员图鉴那边</p>
          <h4>3. 适配</h4>
          <p>(1)较好的适配iPad了，但是iOS13的上，safari有些自己的问题，例如连续快速点击会丢失事件(同样在qq、或者chrome下没有问题)，iOS13的问题无能为力</p>
          <p>(2)安卓用chrome浏览器的添加到桌面的话，体验挺好，还没右下角的浏览器logo。</p>
          <h4>4. 其它</h4>
          <p>(1)换了个App logo</p>
          <p>(2)特别感谢昨天突然来了两个人进群告诉了我几个完全没注意到的问题，不然可能要等上线稳定版之后才能发现。</p>
          <h4>5. 一些做这个东西的思路</h4>
          <p>(1)这个线路看起来是动画，但是实际上动的是渐变色。就是这样</p>
          <code>
            <p>const colors = [</p>
            <p>{ offset: 0, color: `hsla(${color}, 100%, 50%, 0.3)` },</p>
            <p>{ offset: q, color: `hsla(${color}, 100%, 50%, 0.5)` },</p>
            <p>{ offset: p, color: `hsla(${color}, 100%, 50%, 1)` },</p>
            <p>{ offset: Math.min(p + 0.06, 1), color: `hsla(${color}, 100%, 50%, 0)` },</p>
            <p>];</p>
          </code>
          <p>本来前面两个是hsla(${color}, 100%, 50%, 0)的，但是这样不方便截图(0的话就透明了，所以路线不会显示全)，虽然没那么好看了，但是方便截图分享？</p>
          <p>(2)寻路算法一开始自己写了个，但是时不时会遇到了一些奇怪的边界情况要处理，所以，后来换了Pathfinding这个库(啊，这个nb库刚好是Js的)</p>
          <p>(3)canvas用了奇舞团的spritejs。虽然没用上web annimation api (因为现在还没有显示敌人移动的动画，只是展示路线)，但是他们的分层很好用</p>
          <p>(4)因为spritejs有点大300多kb，所以这是资料站里唯一一个用(别人的)CDN的库，虽然是外链CDN，但是放心，一样做了缓存，离线OK(这个站本身也是挂在CDN上的)</p>
          <p>(5)如果之后考虑到服务器安全没问题的话，可能会把这个资料站的代码公布在github。</p>
        </div>
      </my-slide-title>
      <my-slide-title :short="short" title="筛选说明">
        <div>
          <p>1.选了标签（公招）的Tag之后，筛选模式会发生变化</p>
          <p>2.【职业】、【星级】这些分类名，点击可以取消全部选择。</p>
          <p>3.语音√，立绘√，皮肤×，地图信息√，敌人信息√，每波敌人√，弩炮台数据×，路线√， 整合企鹅物流的掉落信息×√</p>
          <p>4.可能夏活前会完全搞定吧。</p>
          <p>5.群799872783！</p>
        </div>
      </my-slide-title>
    </div>
  </div>
</template>

<script>
import { Input, Button, Message, MessageBox, Alert } from 'element-ui';
import Vue from 'vue';
Vue.use(Input);
Vue.use(Button);
Vue.use(Alert);
import InputWrapper from './InputWrapper';
import MyTitle from '../MyTitle';
import MySlideTitle from '../MySlideTilte';

import { submitFeedback } from '../../utils';

export default {
  components: {
    InputWrapper,
    MyTitle,
    MySlideTitle
  },
  props: {
    store: {
      required: true
    },
    short: {
      required: true,
      type: Boolean
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
          this.feedback = '';
          this.store.setItem('tempFeedback', '');
        });
    }
  }
};
</script>

<style lang="stylus" scoped>
.feedback-part {
  margin: 20px 0
}

.feedback-info-wrapper {
  display: flex
}

.feedback-button {
  margin-left: auto
  display: flex
  margin: auto
}

.feedback-button+.feedback-button {
  margin-right: 10px
}
</style>


