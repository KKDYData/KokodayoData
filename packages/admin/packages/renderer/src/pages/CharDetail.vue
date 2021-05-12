<template>
  <div class="char-detail-container px-20">
    <!-- 干员评价 -->
    <InfoSubtitle class="char-detail-subtitle" :title="subtitle[0]" />
    <div class="input-wrapper">
      <div class="w-full text-left">
        请输入对干员 {{ testCharInfo.name }} 的评价：
      </div>
      <ElInput
        v-model="charComment"
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4 }"
        :placeholder="`请输入对干员 ${testCharInfo.name} 的评价`"
      />
    </div>

    <!-- 技能备注 -->
    <InfoSubtitle class="char-detail-subtitle" :title="subtitle[1]" />
    <div class="input-wrapper">
      <div class="w-full text-left">
        请输入对技能 {{ skillOption[chsSkill] }} 的评价：
      </div>
      <ElInput
        v-model="skillComment"
        class="input-with-select"
        :placeholder="`请输入对技能 ${skillOption[chsSkill]} 的评价`"
      >
        <template #prepend>
          <ElSelect v-model="chsSkill" placeholder="请选择">
            <ElOption
              v-for="(skill, skillIdx) in skillOption"
              :key="skillIdx + '_' + skill"
              :label="skillIdx + 1 + '技能：' + skill"
              :value="skillIdx"
            />
          </ElSelect>
        </template>
      </ElInput>
    </div>

    <!-- 关联活动 -->
    <InfoSubtitle class="char-detail-subtitle" :title="subtitle[2]" />
    <div class="text-left ml-6">PS：点击下拉框后可输入关键字搜索</div>
    <div class="input-wrapper">
      <RelateActivitySelect
        class="act-select"
        :select-value="chsAct"
        :option-list="actList"
      />
    </div>

    <!-- 关联卡池 -->
    <!-- <InfoSubtitle class="char-detail-subtitle" :title="subtitle[3]" />
    <div class="text-left ml-6">PS：点击下拉框后可输入关键字搜索</div>
    <div class="input-wrapper">
      <RelateGachaSelect class="act-select" :selectValue="chsGacha" :optionList="gachaList"></RelateGachaSelect>
    </div> -->

    <ElButton class="submit-btn" type="primary" @click="submitAll"
      >提交<i class="el-icon-upload el-icon--right"
    /></ElButton>
  </div>
</template>

<script lang="ts" setup>
import InfoSubtitle from '../components/InfoSubtitle.vue'
import RelateActivitySelect from '../components/RelateActivitySelect.vue'
// import RelateGachaSelect from '../components/RelateGachaSelect.vue'
import { ElInput, ElSelect, ElOption, ElButton } from 'element-plus'
import { isEmptyStr } from '../utils/utils'
import { ApiData } from '@kkdy/api'
import { IActivityInfo } from '@kkdy/data'

// 测试数据
import { testCharInfo } from '../utils/charinfo'
import { testActList } from '../utils/actlist'

const subtitle = ['干员评价', '技能备注', '关联活动', '关联卡池']

// ref: loading = false
ref: charComment = ''
ref: skillComment = ''
ref: chsSkill = 0
const skillOption = testCharInfo.skills.map((val) => {
  return val.levels[0].name
})
ref: actList = [] as IActivityInfo.IInfo[]
ref: chsAct = ''
// ref: gachaList = [] as []
// ref: chsGacha = ''

// ApiData.GetActivityList()
//   .then((res) => {
//     const resData = res.data
//     console.log(resData)
//     if (resData.ok) {
//       actList = resData.result
//     }
//   })
//   .catch((error) => {
//     console.log(error)
//   })
actList = testActList

function submitAll() {
  let submitArr = []

  if (!isEmptyStr(charComment)) {
    submitArr.push(
      new Promise(function (resolve, reject) {
        let para = {
          comment: charComment,
          id: testCharInfo.potentialItemId,
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
          id: testCharInfo.skills[chsSkill].skillId,
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
          targetId: testCharInfo.potentialItemId,
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
.el-textarea {
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
