<template>
  <div class="qa">
    <div class="question">
      <i class="el-icon-question" />
      <slot name="q" />
    </div>
    <div class="answer">
      <i class="el-icon-info" />
      <slot name="a" />
    </div>
  </div>
</template>
<style lang="stylus" scoped>
.qa {
  margin: 10px 5px

  & + .qa {
    margin-top: 20px
  }

  .question {
    color: #313131
    margin: 3px 0
  }
}
</style>
