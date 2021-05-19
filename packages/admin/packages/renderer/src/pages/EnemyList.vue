<template>
  <div class="char-list-container">
    <!-- 条件筛选 -->
    <div class="char-list-filter w-full flex flex-col">
      <FilterButtonGroup
        condtype="level"
        grouptitle="级别"
        :taglist="allCond.level"
        @change-one="changeOne"
        @cancel-all="cancelAll"
      />
      <FilterSearchInput
        grouptitle="搜索"
        @search-input="onInputSearch"
        @clear-input="onClearInput"
      />
    </div>

    <!-- 敌人列表 -->
    <div class="char-list-content">
      <div
        v-for="enemy in filteredList"
        :key="enemy.enemyId"
        class="char-list-column"
      >
        <div class="char-list-column-item">
          <router-link
            :to="'/enemydetail/' + enemy.enemyId + '&' + enemy.info.name"
          >
            <!-- <div class="w-28 h-28 bg-gray-300" :alt="enemy.info.name" :style="{backgroundImage: `url(https://andata.somedata.top/dataX/enemy/pic/${enemy.enemyId}.png?x-oss-process=style/jpg-test)`}" /> -->
            <div class="w-28 h-28 bg-gray-300" :alt="enemy.info.name" />
          </router-link>
          <div
            class="char-name box-border absolute pl-2.5 text-white whitespace-nowrap overflow-ellipsis z-10"
          >
            <div
              class="char-name-zh"
              :style="
                enemy.info.name.split('').length > 6 ? 'font-size: 14px;' : ''
              "
            >
              {{ enemy.info.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import FilterButtonGroup from '../components/FilterButtonGroup.vue'
import FilterSearchInput from '../components/FilterSearchInput.vue'
import { enemyLevelList } from '../utils/constants'
import { Data } from '@kkdy/api'

// 测试数据
import { testEnemyList } from '../utils/enemylist'

// 所有可选过滤条件组
const allCond = reactive({
  level: enemyLevelList, // 敌人级别标签组
})
ref: searchText = '' // 搜索关键字

// allCond获取字段属性专用方法
function getCond<T extends keyof typeof allCond>(key: T) {
  return allCond[key]
}

// ref: loading = false
ref: enemyList = [] as { [k: string]: any }[] // 敌人列表
ref: filteredList = [] as { [k: string]: any }[] // 筛选后的敌人列表

// loading = true
// Data.ListEnemies()
//   .then((res) => {
//     const resData = res.data
//     if (resData.ok) {
//       console.log('enemy list res', resData.result)
//       enemyList = resData.result
//       // loading = false
//     }
//   })
//   .catch((error) => {
//     console.log(error)
//   })

// 本地测试数据
enemyList = testEnemyList

refilterList()

function changeOne(tag: { type: string; index: number }) {
  let condArr = [] as { value: string; text: string; checked: boolean }[]

  switch (tag.type) {
    case 'level':
      condArr = allCond.level
      break
  }

  if (condArr.length > 0) {
    let choice = condArr[tag.index]
    choice.checked = !choice.checked

    refilterList()
  }
}

function cancelAll(tag: { type: string }) {
  switch (tag.type) {
    case 'level':
      allCond.level.forEach((cond) => {
        cond.checked = false
      })
      break
  }

  refilterList()
}

function onInputSearch(input: { str: string }) {
  searchText = input.str
  refilterList()
}

function onClearInput() {
  searchText = ''
  refilterList()
}

function refilterList() {
  filteredList = enemyList

  const filters = Object.keys(allCond)
    .filter((type) => type !== 'token')
    .map((type) => [
      type,
      getCond(type as 'level')
        .filter((cond) => cond.checked === true)
        .map((cond) => cond.value),
    ])

  // 标签组
  for (let data of filters) {
    const group = data[1]

    if (group.length < 1) {
      continue
    } else {
      filteredList = filteredList.filter((enemy) => {
        return group.includes(enemy.info.enemyLevel)
      })
    }
  }

  // 搜索框
  if (searchText.length > 0) {
    const reg = new RegExp(searchText, 'i') // 不区分大小写搜索(猎狗pro、W)
    filteredList = filteredList.filter((enemy) => {
      return enemy.info.name.match(reg)
    })
  }
}
</script>

<style lang="postcss" scoped>
.char-list-container {
  display: flex;
  flex-wrap: wrap;
  margin: 20px auto 50px;
  width: 100%;
  justify-content: space-around;
}

.char-list-content {
  @apply w-full h-auto p-1 flex flex-wrap;
}

.char-list-column {
  display: inline-block;
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid transparent;
}

.char-list-column-item {
  position: relative;
  cursor: pointer;
  width: 100px;
  height: 120px;
  box-sizing: border-box;
  border: 1px solid transparent;
}

.char-list-column-item .char-name {
  top: 85px;
  font-family: 'FZYaSong-H-GBK';
  font-size: 0;
  text-shadow: 1px 0px 2px #313131;
}

.char-list-column-item .char-name-zh {
  min-width: 50px;
  display: inline-block;
  font-size: 18px;
  margin-top: 2px;
  margin-bottom: -4px;
}
</style>
