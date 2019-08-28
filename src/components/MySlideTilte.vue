<template>
  <div class="my-slide-title-wrapper">
    <my-title
      :title="title"
      :freeze="freeze"
      :control="control"
      :short="short"
      @update:value="click"
      :value="value"
      style="margin-bottom: 0"
    ></my-title>
    <div v-show="!control || value" class="extra-button">
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
    const v = this.initValue;
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
      this.$emit('open');
    }
  }
};
</script>

<style lang="stylus" scoped>
.extra-button {
  position: absolute
  right: 0px
  left: 10px
  top: 30px
  z-index: 2
}

.my-slide-title-wrapper {
  position: relative
  margin: 20px 0
}

@media screen and (min-width: 700px) {
  .extra-button {
    left: auto
    right: 20px
  }
}
</style>
