<template>
  <!-- eslint-disable vue/no-v-html -->
  <view>
    <rich-text :nodes="content" />
    <!-- <Teleport
      v-if="itemState.state?.id === innerId && itemState"
      :to="itemState.state.el"
    >
      <view class="h-60vh p-5">
        <Title title-cn="预告？" italic />
        <view class="mt-20rpx">
          <rich-text :nodes="content" />
        </view>
      </view>
    </Teleport> -->
  </view>
</template>

<script setup lang="ts">
import { usePopupState } from '/@/components/Popup/inject'
import { genPopupId } from '/@/components/Popup/genPopupId'
// import Title from '/@/components/Title/Title.vue'

const innerId = genPopupId()

const itemState = usePopupState()

const content = `
<h2 id="todo-list">待完成</h2>
<ol>
<li>[ ] 干员列表入口，现在只能看最新的几个</li>
<li>[ ] 首页信息动态更新</li>
<li>[ ] 合并DPS计算器的分支</li>
<li>[ ] 接入地图api，材料详情/列表页面</li>
<li>[ ] Spine 小人迁移/时装查看页面</li>
<li>[ ] 地图功能迁移/升级</li>
<li>[ ] 后勤技能迁移</li>
<li>[ ] 公招等计算器迁移</li>
<li>[ ] 家具/卡池等其他小功能（后面做到再补充</li>
</ol>
<hr>
<p>大概会上面的顺序更新</p>

`

const open = () => {
  itemState.setPopupId(innerId)
}
</script>

<style lang="styl">
.item-count-tag {
  @apply absolute bottom-0 right-0 z-11;
}
</style>
