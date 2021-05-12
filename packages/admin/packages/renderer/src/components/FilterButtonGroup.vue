<template>
  <div class="filter-row">
    <!-- 左侧标签组名称按钮（切换清空显示） -->
    <ElButton
      :class="
        condtype === 'token'
          ? 'filter-topic closable is-token'
          : haschoose
          ? 'filter-topic closable'
          : 'filter-topic'
      "
      type="info"
      :disabled="tokenflag"
      @click="titleClick"
    >
      <transition name="fade">
        <span
          v-show="haschoose && !(condtype === 'token')"
          class="filter-topic-close-icon"
        >
          <i class="el-icon-close" />
        </span>
      </transition>
      {{ grouptitle }}
    </ElButton>

    <!-- 右侧按钮组 -->
    <ElButton
      v-for="(tag, index) in taglist"
      :key="tag.value"
      :class="'filter-sub' + (tag.checked ? ' checked' : '')"
      :disabled="tokenflag"
      @click="tagClick(index)"
    >
      {{ tag.text }}
    </ElButton>
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, defineProps, watch } from 'vue'
import { ElButton } from 'element-plus'

defineProps<{
  condtype: string
  grouptitle: string
  taglist: { value: string; text: string; checked: boolean }[]
  tokenflag?: boolean
}>()

const instance = getCurrentInstance()!
if (instance.props.condtype === 'token') {
  instance.props.tokenflag = false
}

ref: haschoose = false
if (instance.props.condtype === 'token') {
  haschoose = true
} else {
  let taglist = instance.props.taglist as []
  haschoose = taglist.some((tag: { checked: boolean }) => {
    return tag.checked === true
  })
}

function titleClick() {
  instance.emit('cancel-all', {
    type: instance.props.condtype as string,
  })
}

function tagClick(index: number) {
  if (instance.props.condtype === 'token') {
    instance.emit('switch-token')
  } else {
    instance.emit('change-one', {
      type: instance.props.condtype as string,
      index: index,
    })
  }
}

watch(
  () => [...(instance.props.taglist as { checked: boolean }[])],
  (newlist) => {
    haschoose =
      instance.props.condtype === 'token'
        ? true
        : newlist.some((tag) => {
            return tag.checked
          })
  },
  { deep: true }
)
</script>

<style lang="postcss" scoped>
/* fade动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.fade-leave-to,
.fade-enter {
  opacity: 0;
}

.filter-row {
  @apply w-full px-4 py-2 flex flex-row;
}

.filter-topic,
.filter-sub {
  transition: all 0.5s ease;
}

.filter-topic.closable {
  @apply text-white bg-red-600 !important;
}

.filter-topic.is-disabled.closable,
.filter-sub.is-disabled.checked {
  opacity: 0.35;
}

.filter-sub {
  @apply min-w-min w-18;
}
.filter-sub.checked {
  @apply text-white bg-gray-600 hover:bg-gray-500 !important;
}
</style>
