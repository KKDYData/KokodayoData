<template>
  <div>
    <div class="activity-wrapper">
      <div class="activity-img">
        <r-image :preview-src-list="[activityPic]" :src="activityPic" />
      </div>
      <div class="activity-title">午间逸话</div>
      <div class="activity-content">
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
        <div>
          <span class="activity-info-need">
            最近在对页面进行重构可能有布局异常的问题，如果遇到了请在
            <router-link to="/info">点击这里，往下滑找到“反馈”</router-link>以反馈
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ItemViewer from '@/components/ItemViewer'
import RImage from '@/components/base/RImage'

export default {
  components: {
    ItemViewer,
    RImage
  },
  data() {
    return {
      activityPic: require('./img/wujianyihua.jpg')
    }
  }
}
</script>

<style lang="stylus" scoped>
.activity-wrapper {
  padding: 0 10px
}

.activity {
  &-content {
    //height: 200px
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
      //height: vw(300)
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
