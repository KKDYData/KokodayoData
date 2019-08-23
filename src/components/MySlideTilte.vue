<template>
  <div style="position: relative">
    <my-title
      :title="title"
      :freeze="freeze"
      :control="control"
      :short="short"
      @update:value="click"
      :value="value"
    ></my-title>
    <div v-if="!control || value" class="extra-button">
      <slot name="extra-button"></slot>
    </div>
    <div style="margin-left: 10px">
      <el-collapse-transition>
        <slot v-if="!control || value"></slot>
      </el-collapse-transition>
    </div>
  </div>
</template>

<script>
import MyTitle from './MyTitle';
import Vue from 'vue';
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
Vue.component(CollapseTransition.name, CollapseTransition);

export default {
  components: { MyTitle },
  props: {
    title: {
      required: true,
      type: String
    },
    control: {
      default: true
    },
    short: {
      default: false
    },
    initValue: {
      default: false
    }
  },
  data() {
    const v = !this.short || this.initValue;
    return {
      value: v,
      // 冻结按钮，但是想了下好像没必要
      freeze: false
    };
  },
  methods: {
    click(v) {
      if (this.freeze) return;
      this.value = v;
    }
  }
};
</script>

<style lang="stylus" scoped>
.extra-button {
  position: absolute
  right: 20px
  z-index: 2
}

@media screen and (min-width: 700px) {
  .extra-button {
    top: 30px
  }
}
</style>
