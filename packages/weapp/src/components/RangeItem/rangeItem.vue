<template>
  <view
    ref="container"
    class="grid gap-5px items-center justify-center"
    :style="{
      gridTemplateColumns: `repeat(${col.max - col.min + 1}, minmax(0, 1fr))`,
      gridTemplateRows: `repeat(${row.max - row.min + 1}, minmax(0, 1fr))`,
      maxWidth: `${cellWidth * 1.05 * (col.max - col.min + 1)}px`,
      '--max': cellWidth + 'px',
      gridGap: cellWidth / 20 + 'px',
    }"
  >
    <view
      v-for="cell in rangeData.grids"
      :key="getCellId(cell)"
      class="range-item__cell text-xs"
      :class="{
        hit: cell.col === 0 && cell.row === 0,
      }"
      :style="getStyle(cell)"
    />
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RangeTable } from './rangeTable'
import { IRange } from '@kkdy/data'
import { max, min } from 'ramda'

const props = withDefaults(
  defineProps<{ rangeId: string; minCellWith?: number }>(),
  { minCellWith: 20 }
)

const rangeData = computed((): IRange.IData => {
  const res = Object.assign({}, RangeTable[props.rangeId] as IRange.IData)
  if (!res.grids.find((e) => e.col === 0 && e.row === 0)) {
    res.grids.push({
      col: 0,
      row: 0,
    })
  }
  return res
})

const rc = computed((): { col: 'col' | 'row'; row: 'col' | 'row' } => {
  if (!rangeData.value.direction) {
    return {
      col: 'row',
      row: 'col',
    }
  } else
    return {
      col: 'col',
      row: 'row',
    }
})
const row = computed(() => getMinMax(rc.value.row, rangeData.value))
const col = computed(() => getMinMax(rc.value.col, rangeData.value))

const getMinMax = (prop: 'col' | 'row', data: IRange.IData) => {
  let _min = 0
  let _max = 0
  data.grids.forEach((e) => {
    _min = min(_min, e[prop])
    _max = max(_max, e[prop])
  })

  return {
    min: _min,
    max: _max,
  }
}

const getCellId = (data: IRange.Grid) => {
  return `${data.row}_${data.col}`
}

const getStyle = (data: IRange.Grid) => {
  return {
    gridColumn: `${data[rc.value.col] - col.value.min + 1} / span 1`,
    gridRow: `${data[rc.value.row] - row.value.min + 1} / span 1`,
  }
}

const container = ref(null)
const cellWidth = computed(() => {
  const rMin = 280 / (col.value.max - col.value.min + 1)
  const cMin = 70 / (row.value.max - col.value.min + 1)
  return Math.round(min(min(props.minCellWith, rMin), cMin))
})
</script>

<style lang="stylus">
.range-item__cell {
  max-width: var(--max)
  max-height var(--max)
  width: var(--max)
  height: var(--max)
  @apply  relative border border-hex-858484 border-8

  &:before{
    content: ' '
  }

  &.hit {
    @apply bg-blue-400 bg-hex-858484;
  }
}
</style>
