<template>
  <div class="filter-row">
    <!-- 左侧标签组名称按钮（切换清空显示） -->
    <ElButton
      :class="haschoose ? 'filter-topic closable' : 'filter-topic'"
      type="info"
      :disabled="tokenflag"
      >{{ grouptitle }}</ElButton
    >

    <!-- 右侧下拉框 -->
    <ElSelect
      v-model="selectValue"
      filterable
      clearable
      :disabled="tokenflag"
      :placeholder="'请选择关联活动'"
      @change="onChangeSelect"
      @clear="onClearSelect"
    >
      <ElOption
        v-for="(item, index) in optionList"
        :key="index + '_' + item.id"
        :label="item.name"
        :value="item.id"
      >
        <span style="float: left">{{ item.name }}</span>
        <span style="float: right"
          >活动时间：{{
            new Date(item.startTime * 1000).toLocaleDateString() +
            ' ~ ' +
            new Date(item.endTime * 1000).toLocaleDateString()
          }}</span
        >
      </ElOption>
    </ElSelect>
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, defineProps } from 'vue'
import { ElSelect, ElOption, ElButton } from 'element-plus'

defineProps<{
  condtype: string
  grouptitle: string
  selectValue: string
  optionList: { [k: string]: any }[]
  tokenflag?: boolean
}>()

const instance = getCurrentInstance()!

ref: haschoose = false

function onChangeSelect(id: string) {
  instance.emit('change-select', {
    type: instance.props.condtype as string,
    id: id,
  })
}

function onClearSelect(e: any) {
  instance.emit('clear-select', {
    type: instance.props.condtype as string,
  })
}
</script>

<style lang="postcss" scoped>
.filter-row {
  @apply w-full px-4 py-2 flex flex-row;
}

.filter-topic {
  transition: all 0.5s ease;
}

.filter-topic.closable {
  @apply text-white bg-red-600 !important;
}

.el-button + .el-select {
  margin-left: 10px;
}
</style>
