<template>
  <div class="info-container">
    <my-title title="Q&A" />
    <div class="question">
      <q-a>
        <span slot="q">游戏数据哪里来的？</span>
        <span slot="a">从网上找到的拆包，经过简单的分割，然后纯前端进行渲染</span>
      </q-a>
      <q-a>
        <span slot="q">网站有几个人在维护</span>
        <span slot="a">1个开发，我；1个下班后可以切图的工具人；1个爸爸工具人；1个反馈工具群。网页图标是我朋友画的。</span>
      </q-a>
      <q-a>
        <span slot="q">网站的运作方式</span>
        <span slot="a">游戏数据更新之后，我会在1个小时内（通常半小时）把文本数据更新好；图片、语音通常在当天晚上补全；小人这种可能第二天。</span>
      </q-a>
      <q-a>
        <span slot="q">会有资金问题吗？</span>
        <span slot="a">
          以前没有，但春节前着迷停止服务之后，到2月2日，网站的日活数据从以前的长草期2k5UV，提高到了5k5。而有活动的话，预计在2-3倍。
          <br />以至于，本来一个月只跑130gb左右的流量，现在一周跑了130gb。月消费可能从100元左右变成400元左右，因为阿里云主要是购买资源包，所以有待观察。
        </span>
      </q-a>
      <q-a>
        <span slot="q">我想捐款</span>
        <span slot="a">我有二维码。投食的时候，最好备注信息(例如：kkdy)。</span>
      </q-a>
      <div style="display:flex;">
        <r-image :preview-src-list="[zfb]" :src="zfb" />
        <r-image :preview-src-list="[wx]" :src="wx" />
      </div>
      <div style="margin-bottom: 20px">
        <a href="https://docs.qq.com/sheet/DTGFQU05VemVScHpS?c=J10A0A0" type="info">
          Kokodayo 2020 收支一览
          <sup>new</sup>
        </a>，暂时还没空整理的更详细一点。
      </div>
    </div>
    <my-title title="测试版" />
    <p>
      <a href="https://test.kokodayo.fun" type="info">
        Beta版链接
        <sup>new</sup>
      </a>，这是我测试用的。我简单测一下，没bug就会更新到稳定版。如果之后稳定版发现bug，修复之后只会（暂时）推送到稳定版。
    </p>
    <p>
      <b>
        <u>目前兼容到安卓5+，ios10+，不支持ie</u>
      </b>
    </p>
    <p style="color: #515151">反馈群799872783(需要答一个简单的问题)</p>
    <my-slide-title title="反馈">
      <div class="feedback-part">
        <p style="color: #515151">在Github提Issue也行</p>
        <input-wrapper style="width: 300px;margin-right: 30px" title="昵称">
          <template>
            <el-input v-model="id" placeholder="你是谁" />
          </template>
        </input-wrapper>
        <input-wrapper style="width: 300px" title="邮箱">
          <template>
            <el-input v-model="email" type="email" placeholder="我可能会找你获取详细信息" />
          </template>
        </input-wrapper>

        <div>
          <input-wrapper title="标题">
            <template>
              <el-input v-model="title" placeholder="可选标题" />
            </template>
          </input-wrapper>
        </div>
        <input-wrapper title="反馈">
          <el-input v-model="feedback" type="textarea" :rows="2" placeholder="在这里提交的反馈，会发邮件到我邮箱" />
        </input-wrapper>
        <div class="feedback-button">
          <el-button icon="el-icon-delete" circle plain @click="feedback = ''" />
          <el-button type="primary" @click="submitFb">提交</el-button>
        </div>
      </div>
    </my-slide-title>

    <div>
      <my-slide-title title="v1.0 准备中， 列出来的是完成的">
        <div>
          <p>1. 增加游戏里的spine 小人展示，及相对应的改进立绘面板，以及新增单独的皮肤页面</p>
          <p>2. 修复公招筛选的一系列bug...）</p>
          <p>3. 基建技能</p>
          <p>4. 干员详情最底下的资料里，增加信物描述</p>
        </div>
      </my-slide-title>
      <my-slide-title title="筛选说明">
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
import { Input, Button, Message, MessageBox, Alert } from 'element-ui'
import Vue from 'vue'
Vue.use(Input)
Vue.use(Button)
Vue.use(Alert)
import InputWrapper from './InputWrapper'
import QA from './QA'
import MyTitle from '@/components/base/MyTitle'
import MySlideTitle from '@/components/base/MySlideTilte'
import RImage from '@/components/base/RImage'

import { submitFeedback } from '@/utils/fetch'
import { mapState } from 'vuex'
import { localStore } from '../../localStore'

export default {
  components: {
    InputWrapper,
    MyTitle,
    MySlideTitle,
    QA,
    RImage
  },
  data() {
    return {
      feedback: '',
      id: '',
      title: '',
      email: '',
      debounceLogFb: null,
      store: localStore()
    }
  },
  computed: {
    ...mapState(['short']),
    zfb() {
      return require('./img/zfb.png')
    },
    wx() {
      return require('./img/wx.png')
    }
  },
  watch: {
    feedback() {
      clearTimeout(this.debounceLogFb)
      this.debounceLogFb = setTimeout(async () => {
        await this.store.setItem('tempFeedback', this.feedback)
        console.log('save success')
      }, 1000)
    }
  },
  async mounted() {
    const lastFeedback = await this.store.getItem('tempFeedback')
    const lastFeedbackID = await this.store.getItem('feedbackID')
    if (lastFeedback) {
      this.feedback = lastFeedback
      Message.success('成功恢复上次反馈但未提交的内容')
    }
    if (lastFeedbackID) {
      this.id = lastFeedbackID
    }
  },
  methods: {
    async submitFb() {
      if (!this.id) {
        Message.warning('必须填昵称')
        return
      }
      if (!/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/.test(this.id)) {
        Message.warning('昵称不能包含特殊符号')
        return
      }
      if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.email)) {
        Message.warning('邮箱格式不对（xxx@xxx.xxx）')
        return
      }
      if (!this.feedback) {
        Message.warning('反馈内容不能为空')
        return
      }
      const lastId = await this.store.getItem('feedbackID')
      if (!lastId) {
        await this.store.setItem('feedbackID', this.id)
      }
      if (lastId && lastId !== this.id) {
        await MessageBox.confirm(
          `这次的昵称(${this.id})和上次不一样，需要换成上次(${lastId})的吗？`,
          '昵称不一致'
        )
          .then(el => {
            this.id = lastId
          })
          .catch(el => {
            this.store.setItem('feedbackID', this.id)
          })
      }
      MessageBox.confirm(
        `内容: ${this.feedback}`,
        `确认提交内容, ID: ${this.id}, 邮箱：${this.email}`
      )
        .then(el => {
          this.submit()
        })
        .catch(el => {
          Message.info('取消')
        })
    },
    submit() {
      const data = { title: this.title, id: this.id, content: this.feedback + ' \n 邮箱：' + this.email }
      return submitFeedback(data)
        .catch(err => {
          console.error(err)
        })
        .then(res => {
          MessageBox.confirm('反馈成功，感谢你的支持',
            '如果没留邮箱建议进群哦～')
          this.feedback = ''
          this.store.setItem('tempFeedback', '')
        })
    }
  }
}
</script>

<style lang="stylus" scoped>
.info-container {
  margin: 20px auto
  max-width: 1000px
}

.feedback-part {
  & >>> input {
    &:invalid {
      color: red
    }
  }
}

.feedback-button {
  text-align: right
}

.feedback-button+.feedback-button {
  margin-right: 10px
}

h4 {
  padding-top: 20px
}

p {
  margin: 0
  padding: 20px 0
}

@media screen and (max-width: 1000px) {
  .info-container {
    padding: 0 20px
  }
}

@media screen and (max-width: 500px) {
  .info-container {
    padding: 0 vw(20)
  }
}
</style>


