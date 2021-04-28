<template>
  <ElSelect
    v-model="selectValue"
    filterable
    clearable
    :placeholder="'请选择关联活动'"
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
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import { ElSelect, ElOption } from 'element-plus'

interface Activity {
  id: number
  name: string
  startTime: number
  endTime: number
}

defineProps<{
  selectValue: string
  optionList: Activity[]
}>()
</script>

<style lang="css" scoped>
.el-select {
  @apply mt-1;
}

.subtitle-decoration {
  border-bottom: 42px solid rgba(75, 85, 99, 1);
  border-right: 40px solid;
}
</style>
