<template>
  <div class="char-list-container">
    <!-- 条件筛选 -->
    <div class="w-full flex flex-col">
      <FilterButtonGroup
        condtype="token"
        grouptitle="切换"
        :taglist="allCond.token"
        @switch-token="switchType"
      />
      <FilterButtonGroup
        condtype="profs"
        grouptitle="职业"
        :taglist="allCond.profs"
        :tokenflag="tokenflag"
        @change-one="changeOne"
        @cancel-all="cancelAll"
      />
      <FilterButtonGroup
        condtype="stars"
        grouptitle="星级"
        :taglist="allCond.stars"
        :tokenflag="tokenflag"
        @change-one="changeOne"
        @cancel-all="cancelAll"
      />
    </div>
    <!-- 干员列表 -->
    <div
      v-for="agent in filteredList"
      :key="agent.charId"
      class="char-list-column"
    >
      <div class="char-list-column-item">
        <router-link :to="'/chardetail/' + agent.charId">
          <div class="w-28 h-28 bg-gray-300" :alt="agent.name" />
        </router-link>
        <div
          class="char-name box-border absolute pl-2.5 text-white whitespace-nowrap overflow-ellipsis z-10"
        >
          <div
            class="char-name-zh"
            :style="agent.name.split('').length > 6 ? 'font-size: 14px;' : ''"
          >
            {{ agent.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import FilterButtonGroup from '../components/FilterButtonGroup.vue'
import { tokenSwitch, professionList, rarityList } from '../utils/constants'
// import { testlist } from '../utils/charlist'
import { ApiData } from '@kkdy/api'

// 所有可选过滤条件组
const allCond = reactive({
  token: tokenSwitch.map((tag) => {
    return {
      value: tag.value,
      text: tag.text,
      checked: tag.value === 'CHAR',
    }
  }), // 干员召唤物切换
  stars: rarityList, // 星级标签组
  profs: professionList, // 职业标签组
})

// ref: loading = false
ref: charList = []
ref: filteredList = []
ref: tokenflag = false

// loading = true
// ApiData.GetCharacterList()
//   .then((res) => {
//     const resData = res.data
//     if (resData.ok) {
//       console.log('char list res', resData.result)
//       charList = resData.result
//       filteredList = resData.result
//       // loading = false
//     }
//   })
//   .catch((error) => {
//     console.log(error)
//   })

// 本地测试数据
// charList = testlist
// filteredList = testlist

refilterList()

function switchType() {
  allCond.token.forEach((tag) => (tag.checked = !tag.checked))
  const switchflag = allCond.token
    .filter((el) => el.checked === true)
    .map((tag) => tag.value)
  tokenflag = switchflag[0] === 'TOKEN'
  console.log('tokenflag', tokenflag)

  refilterList(switchflag[0])
}

function changeOne(tag: { type: string; index: number }) {
  let condArr = [] as { value: string; text: string; checked: boolean }[]

  switch (tag.type) {
    case 'profs':
      condArr = allCond.profs
      break
    case 'stars':
      condArr = allCond.stars
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
    case 'profs':
      allCond.profs.forEach((cond) => {
        cond.checked = false
      })
      break
    case 'stars':
      allCond.stars.forEach((cond) => {
        cond.checked = false
      })
      break
  }

  refilterList()
}

function refilterList(switchflag = 'CHAR') {
  filteredList = charList

  let filterChar = switchflag === 'CHAR'

  if (filterChar) {
    const filters = Object.keys(allCond)
      .filter((cond) => cond !== 'token')
      .map((el) => [
        el,
        allCond[el]
          .filter((tag) => tag.checked === true)
          .map((tag) => tag.value),
      ])

    for (let data of filters) {
      const group = data[1]

      if (group.length < 1) {
        continue
      } else {
        filteredList = filteredList.filter((char) => {
          return (
            !(char.profession === 'TOKEN' || char.profession === 'TRAP') && // 召唤物的 profession 为 TOKEN 或 TRAP
            (group.includes(char.profession) ||
              group.includes(char.rarity + 1 + ''))
          )
        })
      }
    }
  } else {
    filteredList = filteredList.filter(
      (char) => char.profession === 'TOKEN' || char.profession === 'TRAP'
    )
  }
}
</script>

<style lang="css" scoped>
.char-list-container {
  display: flex;
  flex-wrap: wrap;
  margin: 20px auto 50px;
  width: 100%;
  justify-content: space-around;
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
