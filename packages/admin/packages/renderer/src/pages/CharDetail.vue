<template>
  <div class="char-detail-container px-20">
    <!-- 干员评价 -->
    <info-subtitle class="char-detail-subtitle" :title="subtitle[0]" />
    <div class="input-wrapper">
      <div class="w-full text-left">
        请输入对干员 {{ testInfo.name }} 的评价：
      </div>
      <el-input
        v-model="charComment"
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4 }"
        :placeholder="`请输入对干员 ${testInfo.name} 的评价`"
      />
    </div>

    <!-- 技能备注 -->
    <info-subtitle class="char-detail-subtitle" :title="subtitle[1]" />
    <div class="input-wrapper">
      <div class="w-full text-left">
        请输入对技能 {{ skillOption[chsSkill] }} 的评价：
      </div>
      <el-input
        v-model="skillComment"
        class="input-with-select"
        :placeholder="`请输入对技能 ${skillOption[chsSkill]} 的评价`"
      >
        <template #prepend>
          <el-select v-model="chsSkill" placeholder="请选择">
            <el-option
              v-for="(skill, skillIdx) in skillOption"
              :key="skillIdx + '_' + skill"
              :label="skillIdx + 1 + '技能：' + skill"
              :value="skillIdx"
            />
          </el-select>
        </template>
      </el-input>
    </div>

    <!-- 关联活动 -->
    <info-subtitle class="char-detail-subtitle" :title="subtitle[2]" />
    <div class="input-wrapper">
      <el-select
        v-model="chsAct"
        class="act-select"
        filterable
        clearable
        placeholder="请选择关联活动"
      >
        <el-option
          v-for="(act, actIdx) in actList"
          :key="actIdx + '_' + act.id"
          :label="act.name"
          :value="act.id"
        >
          <span style="float: left">{{ act.name }}</span>
          <span style="float: right"
            >活动时间：{{
              new Date(act.startTime * 1000).toLocaleDateString() +
              ' ~ ' +
              new Date(act.endTime * 1000).toLocaleDateString()
            }}</span
          >
        </el-option>
      </el-select>
    </div>

    <el-button class="submit-btn" type="primary" @click="submitAll"
      >提交<i class="el-icon-upload el-icon--right"
    /></el-button>
  </div>
</template>

<script lang="ts" setup>
// import { reactive, provide } from 'vue'
import InfoSubtitle from '../components/InfoSubtitle.vue'
import { ElInput, ElSelect, ElOption, ElButton } from 'element-plus'
import { isEmptyStr } from '../../public/utils/utils'
import { ApiData } from '@kkdy/api'

const subtitle = ['干员评价', '技能备注', '关联活动']

// ref: loading = false
// ref: charInfo = reactive(testInfo) // testInfo 是陈的测试数据
// provide('charInfo', charInfo) // 向子组件传递干员数据
ref: charComment = '' as string
ref: skillComment = '' as string
ref: chsSkill = 0
ref: skillOption = testInfo.skills.map((val) => {
  return val.levels[0].name
})
ref: actList = []
ref: chsAct = ''

ApiData.GetActivityList()
  .then((res) => {
    const resData = res.data
    console.log(resData)
    if (resData.ok) {
      actList = resData.result
    }
  })
  .catch((error) => {
    console.log(error)
  })

function submitAll() {
  let submitArr = []

  if (!isEmptyStr(charComment)) {
    submitArr.push(
      new Promise(function (resolve, reject) {
        let para = {
          comment: charComment,
          id: testInfo.potentialItemId,
        }
        console.log('charComment para', para)
        ApiData.UpdateCharCharComment(para)
          .then((res) => {
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      })
    )
  }

  if (!isEmptyStr(skillComment)) {
    submitArr.push(
      new Promise(function (resolve, reject) {
        let para = {
          comment: skillComment,
          id: testInfo.skills[chsSkill].skillId,
        }
        console.log('skillComment para', para)
        ApiData.UpdateCharSkillComment(para)
          .then((res) => {
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      })
    )
  }

  if (chsAct.length > 0) {
    submitArr.push(
      new Promise(function (resolve, reject) {
        let para = {
          targetId: testInfo.potentialItemId,
          relativeId: chsAct,
        }
        console.log('RelativeAct para', para)
        ApiData.UpdateRelativeChar(para)
          .then((res) => {
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      })
    )
  }

  Promise.all(submitArr)
    .then(function (results) {
      // console.log("all resolve", results)
      results.forEach(function (result) {
        console.log(result)
      })
    })
    .catch(function (err) {
      console.log('with reject', err)
    })
}
</script>

<style lang="css" scoped>
.input-wrapper {
  @apply ml-6 py-1 flex flex-col;
}
.el-input,
.el-textarea,
.act-select {
  @apply mt-1;
}

.el-textarea,
.input-with-select,
.act-select {
  width: 70%;
}

/* 技能备注 输入框 */
.input-with-select .el-select {
  width: 175px;
}

/* 提交 按钮 */
.submit-btn {
  @apply my-5 bg-green-500 border-transparent !important;
}
</style>
