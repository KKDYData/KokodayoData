<template>
  <div class="char-list-container">
    <!-- 条件筛选 -->
    <div />
    <!-- 干员列表 -->
    <div v-for="agent in charList" :key="agent.charId" class="char-list-column">
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
import { ApiData } from '@kkdy/api'

// ref: loading = false
ref: charList = []

// loading = true
ApiData.GetCharacterList()
  .then((res) => {
    const resData = res.data
    if (resData.ok) {
      console.log('char list res', resData.result)
      charList = resData.result
      // loading = false
    }
  })
  .catch((error) => {
    console.log(error)
  })
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
