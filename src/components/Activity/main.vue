<template>
  <div>
    <div class="activity-wrapper">
      <div class="activity-title" style="margin-bottom: 10px; color: #ff5200">新增基建技能页面</div>
      <div class="activity-img">
        <r-image :preview-src-list="[activityPic]" :src="activityPic" />
      </div>
      <div class="activity-title">元宵刷图活动</div>
      <div class="activity-content">
        <div>大部分地图会掉落【岁过华灯】,为了方便，把它单独放了出来，点击可以查看掉落详情</div>
        <div style="height: 100px">
          <item-viewer class="activity-item" type="item" item="randomMaterial_2" />
        </div>
        <div>
          <span class="activity-info-need">如果消耗理智非常少，注意检查样本数</span>
        </div>
        <div>
          <span class="activity-info-need">最近在对页面进行重构可能有布局异常的问题</span>
        </div>
        <div class="activity-info-need">
          <a target="_blank" href="https://penguin-stats.io/">数据来源&收集：企鹅物流</a>
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
      activityPic: require('./img/yuanxiao.jpg')
    }
  }
}
</script>

<style lang="stylus" scoped>
.activity-wrapper {
  padding: 0 10px
}

.activity {
  &-item {
    display: inline-block
  }

  &-content {
    //height: 200px
  }

  &-img {
    height: 90x
  }

  &-title {
    font-size: 20px
    color: #313131
  }

  &-info-need {
    font-size: 14px
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
