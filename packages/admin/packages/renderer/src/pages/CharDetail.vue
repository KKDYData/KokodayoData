<template>
  <div v-if="loading" />
  <div v-else class="char-detail-container mt-8 px-20">
    <!-- 干员备注 -->
    <InfoSubtitle class="char-detail-subtitle" :title="subtitle[0]" />
    <div class="input-wrapper">
      <div class="w-full text-left">
        请输入对干员 {{ charInfo.name }} 的备注（如特性介绍或伤害计算公式）：
      </div>
      <ElInput
        v-model="charComment"
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4 }"
        :placeholder="`请输入对干员 ${charInfo.name} 的备注`"
      />
    </div>

    <!-- 技能备注 -->
    <InfoSubtitle class="char-detail-subtitle" :title="subtitle[1]" />
    <div class="input-wrapper">
      <div class="w-full text-left">
        请输入对技能
        {{ skillOption[chsSkill] }} 的备注（如特性介绍或伤害计算公式）：
      </div>
      <ElInput
        v-model="skillComment"
        class="input-with-select"
        :placeholder="`请输入对技能 ${skillOption[chsSkill]} 的备注`"
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
        :option-list="actList"
        @change-select="onActvChange"
      />
    </div>

    <ElButton class="submit-btn" type="primary" @click="submitAll">
      提交<i class="el-icon-upload el-icon--right" />
    </ElButton>
  </div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import InfoSubtitle from '../components/InfoSubtitle.vue'
import RelateActivitySelect from '../components/RelateActivitySelect.vue'
import {
  ElInput,
  ElSelect,
  ElOption,
  ElButton,
  ElMessageBox,
} from 'element-plus'
import { isEmptyStr } from '../utils/utils'
import { Data, Update } from '@kkdy/api'
// import { IActivityInfo } from '@kkdy/data'

// 测试数据
import { testCharInfo } from '../utils/charinfo'
import { testActList } from '../utils/actlist'

ref: loading = true
ref: charInfo = {} as { [k: string]: any }
ref: charComment = ''
ref: skillComment = ''
ref: chsSkill = 0
ref: skillOption = [] as string[]
// ref: actList = [] as Array<IActivityInfo.IInfo>
ref: actList = [] as { [k: string]: any }[]
ref: chsAct = ''

const charId = useRoute().params.charid as string | ''
if (!isEmptyStr(charId)) {
  let loadPromiseArr = [] // 数据加载promise数组

  loadPromiseArr.push(
    new Promise(function (resolve, reject) {
      Update.GetChar({ id: charId })
        .then((res) => {
          const resData = res.data
          console.log(resData)
          if (resData.ok) {
            charInfo = resData.result
            skillOption = charInfo.skills.map((val: any) => {
              return val.levels[0].name
            })
            loading = false
          }
          resolve(res)
        })
        .catch((err) => {
          loading = false
          console.log(err)
          reject(err)
        })

      // Data.UpdateCharCharComment(para)
      //   .then((res) => {
      //     resolve(res)
      //   })
      //   .catch((err) => {
      //     reject(err)
      //   })
    })
  )

  Update.GetChar({ id: charId })
    .then((res) => {
      const resData = res.data
      console.log(resData)
      if (resData.ok) {
        charInfo = resData.result
        skillOption = charInfo.skills.map((val: any) => {
          return val.levels[0].name
        })
      }
    })
    .catch((error) => {
      console.log(error)
    })
} else {
  useRouter().back()
  // charInfo = testCharInfo // 测试干员数据
}
const subtitle = ['干员备注', '技能备注', '关联活动']

// Data.GetActivityList()
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

function onActvChange(target: { id: string }) {
  chsAct = target.id
}

function submitAll() {
  let submitArr = []

  if (!isEmptyStr(charComment)) {
    submitArr.push(
      new Promise(function (resolve, reject) {
        let para = {
          comment: charComment,
          id: charInfo.potentialItemId,
        }
        console.log('charComment para', para)
        Data.UpdateCharCharComment(para)
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
          comments: [skillComment],
          id: charInfo.skills[chsSkill].skillId,
        }
        console.log('skillComment para', para)
        Data.UpdateCharSkillComment(para)
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
          targetId: charInfo.potentialItemId,
          relativeId: chsAct,
        }
        console.log('RelativeAct para', para)
        Data.UpdateRelativeChar(para)
          .then((res) => {
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      })
    )
  }

  if (submitArr.length > 0) {
    Promise.all(submitArr)
      .then(function (results) {
        console.log('all resolve', results)
        // results.forEach(function (result) {
        //   console.log(result)
        // })
        ElMessageBox({
          title: '提交成功',
          confirmButtonText: '确定',
          type: 'success',
          center: true,
        })
      })
      .catch(function (err) {
        console.log('with reject', err)
        ElMessageBox.alert(
          '提交过程中出现错误：' + err + '请稍后重试或提交issue',
          '提交错误',
          {
            confirmButtonText: '确定',
            type: 'error',
            center: true,
          }
        )
      })
  } else {
    ElMessageBox.alert('请至少填写一项后再提交', '提交错误', {
      confirmButtonText: '确定',
      type: 'error',
      center: true,
    })
  }
}
</script>

<style lang="postcss" scoped>
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
