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
        <span
          class="activity-info-need"
        >Logo换新</span>
      </div>
      <div style="margin-top: 20px">
        <p class="activity-info-need">
          <span>2021 1/20 近期计划:<del>开始改版 </del> 预计有两个新功能, 准备建文件夹了！</span>
        </p>
        <p class="activity-info-need">1. 小程序开发中...</p>
        <p class="activity-info-need">2. 地图更换渲染引擎以获取更好的展现效果和性能</p>
        <p class="activity-info-need">3. 如果有兴趣帮忙做下测试完善敌人/干员图鉴的内容.</p>
      </div>
      <div style="margin-top: 20px">
        <span class="activity-info-need">
          <router-link to="/info">点击这里</router-link>，往下滑找到“反馈”以反馈问题。
        </span>
      </div>
      <div style="margin-top: 20px">
        <span class="activity-info-need light">企鹅物流的掉落数据，同步时间为10分钟/次。</span>
      </div>
    </div>
  </div>
</template>

<script>
// import ItemViewer from '@/components/ItemViewer'
// import RImage from '@/components/Base/RImage'

export default {
  components: {
    // ItemViewer,
    // RImage
  },
  data() {
    return {
      activityPic: require('./img/anniversary.jpg')
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
