<template>
  <div>
    <div class="activity-wrapper">
      <!-- <div class="activity-img">
        <r-image :preview-src-list="[activityPic]" :src="activityPic" />
      </div>-->
      <!-- <div class="activity-title">午间逸话</div> -->
      <!-- <div class="activity-content">
        <div class="activity-info-need">SA-1 → 6 主要掉落如下</div>
        <div class="activity-drop-list">
          <item-viewer class="activity-item" type="item" item="30061" />
          <item-viewer class="activity-item" type="item" item="30051" />
          <item-viewer class="activity-item" type="item" item="30032" />
          <item-viewer class="activity-item" type="item" item="30042" />
          <item-viewer class="activity-item" type="item" item="30073" />
          <item-viewer class="activity-item" type="item" item="31023" />
        </div>
        <div>
          <span class="activity-info-need">如果消耗理智非常少，注意检查样本数</span>
        </div>
        <div class="activity-info-need">
          <a target="_blank" href="https://penguin-stats.io/">数据来源&收集：企鹅物流</a>
        </div>
      </div>-->
      <div style="margin-top: 20px">
        <r-image
          :preview-src-list="shouldPreview ? ads : []"
          :src="src"
          @click="go"
        />
        <p>
          <a target="_blank" :href="link" @click="log">
            点这里支持kkdy
          </a>
        </p>
      </div>
      <div style="margin-top: 20px">
        <p class="activity-info-need">
          <span>
            2021 12/30
          </span>
        </p>
        <p class="activity-info-need">
          竟然接到了商单，想支持kkdy继续下去的话，可以点击上面看看
          <span style="color: #d5656c">
            （要注册，邀请码填kkdy）
          </span>
          直接支持可以点击关于里面有收款码，或者小程序搜kkdy（海珠店那个），直接点一个请od喝冷萃。
        </p>
        <p class="activity-info-need"><del>小程序开发中...</del> 快了</p>
        <p class="activity-info-need">
          2021 2/18 更新敌人属性的翻译，并且点击、悬浮会显示原始值
        </p>
      </div>
      <div style="margin-top: 20px">
        <span class="activity-info-need">
          <router-link to="/info">点击这里</router-link>
          ，往下滑找到“反馈”以反馈问题。
        </span>
      </div>
      <div style="margin-top: 20px">
        <span class="activity-info-need light">
          企鹅物流的掉落数据，同步时间为10分钟/次。
        </span>
      </div>
    </div>
  </div>
</template>

<script>
// import ItemViewer from '@/components/ItemViewer'
import RImage from '@/components/Base/RImage'
import { dataPath } from '@/utils/listVer'
import { mapState } from 'vuex'

export default {
  components: {
    // ItemViewer,
    RImage,
  },
  data() {
    return {
      activityPic: [`${dataPath}/ads/kkdy.png`],
      adsPicM: [
        `${dataPath}/ads/kkdy11.png`,
        `${dataPath}/ads/%E6%98%8E%E6%97%A5%E6%96%B9%E8%88%9Fkkdy.png`,
      ],
      link:
        'http://mp.weixin.qq.com/s?__biz=Mzg3NDY0NjUzNg==&mid=100002319&idx=1&sn=5ae6f886858d74feb56a9b571ec97ab8&chksm=4eccd76879bb5e7e0c44226a2dcad8a1407f2bca9d8d56b01d60c5ce18e80fc63358a6d063c9#rd',
    }
  },
  computed: {
    ...mapState(['extraSkins', 'short']),
    shouldPreview() {
      return !!Math.round(Math.random()) || this.short
    },
    ads() {
      return !this.shouldPreview ? this.activityPic : this.adsPicM
    },

    src() {
      const r = this.ads.length > 1 ? Math.round(Math.random()) : 0
      return this.ads[r]
    },
  },
  methods: {
    go() {
      if (!this.shouldPreview) {
        window.open(this.link, '__blank')
        this.log()
      }
    },
    log() {
      gtag('event', 'view_item', {
        event_category: 'noknok',
        event_label: 'ads',
      })
    },
  },
}
</script>

<style lang="stylus" scoped>
.activity-wrapper {
  padding: 0 10px
}

.activity {
  &-content {
    // height: 200px
  }

  &-img {
    height: 90x

    &.out-of-date {
      filter: grayscale(1)
    }
  }

  &-title {
    font-size: 20px
    color: #313131
  }

  &-info-need {
    font-size: 14px

    &.light {
      opacity: 0.5
    }
  }

  &-item {
    display: inline-block
    margin: 5px
  }

  &-drop-list {
    display: flex
    flex-wrap: wrap
    margin-bottom: 20px
  }
}

@media screen and (max-width: 500px) {
  .activity {
    &-wrapper {
      padding: 0 vw(20)
    }

    &-img {
      height: vw(210)
    }

    &-item {
      display: inline-block
      vw(10)
    }

    &-content {
      // height: vw(300)
    }

    &-title {
      font-size: vw(40)
    }

    &-info-need {
      font-size: vw(28)
    }
  }
}
</style>
