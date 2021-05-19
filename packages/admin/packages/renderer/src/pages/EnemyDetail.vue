<template>
  <div class="char-detail-container mt-8 px-20">
    <!-- 敌人备注 -->
    <InfoSubtitle class="char-detail-subtitle" :title="subtitle[0]" />
    <div class="input-wrapper">
      <div class="w-full text-left">
        请输入对敌人 {{ enemyName }} 的备注（如特性介绍或伤害计算公式）：
      </div>
      <ElInput
        v-model="enemyComment"
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4 }"
        :placeholder="`请输入对敌人 ${enemyName} 的备注`"
      />
    </div>

    <ElButton class="submit-btn" type="primary" @click="submitAll">
      提交<i class="el-icon-upload el-icon--right" />
    </ElButton>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import InfoSubtitle from '../components/InfoSubtitle.vue'
import { ElInput, ElButton, ElMessageBox } from 'element-plus'
import { isEmptyStr } from '../utils/utils'
import { Data } from '@kkdy/api'

// ref: loading = true
ref: enemyComment = ''

const enemyId = useRoute().params.enemyid as string | ''
const enemyName = useRoute().params.name as string | ''
console.log('enemyId', enemyId)
console.log('enemyName', enemyName)
const subtitle = ['敌人备注']

function submitAll() {
  let submitArr = []

  if (!isEmptyStr(enemyComment)) {
    submitArr.push(
      new Promise(function (resolve, reject) {
        let para = {
          comments: [enemyComment],
          id: enemyId,
        }
        console.log('enemyComment para', para)
        Data.UpdateEnemyComments(para)
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

.el-textarea {
  width: 70%;
}

/* 提交 按钮 */
.submit-btn {
  @apply my-5 bg-green-500 border-transparent !important;
}
</style>
