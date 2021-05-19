<template>
  <div class="filter-row">
    <!-- 左侧标签组名称 -->
    <ElButton class="filter-topic" type="info">{{ grouptitle }}</ElButton>

    <!-- 右侧输入框 -->
    <ElInput
      v-model="searchText"
      class="filter-input"
      clearable
      :placeholder="!placeholder ? '请输入敌人名称关键字进行筛选' : placeholder"
      @change="onEnter"
      @clear="onClear"
    />
    <!-- @input="onInput" 防抖之后再加上 -->
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, defineProps } from 'vue'
import { ElButton, ElInput } from 'element-plus'

defineProps<{
  grouptitle: string
  placeholder?: string | ''
}>()

const instance = getCurrentInstance()!
ref: searchText = ''

// function onInput(str: string) {
//   instance.emit('search-input', {
//     str: str,
//   })
// }

function onEnter(str: string) {
  instance.emit('search-input', {
    str: str,
  })
}

function onClear() {
  instance.emit('clear-input')
}
</script>

<style lang="postcss" scoped>
.filter-row {
  @apply w-full px-4 py-2 flex flex-row;
}

.filter-input {
  @apply w-3/5;
}

.el-button + .el-input {
  margin-left: 10px;
}
</style>
