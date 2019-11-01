<template>
  <div class="my-slide-title-wrapper">
    <slot name="const-content"></slot>

    <my-title
      :title="title"
      :control="control"
      @click="click($event)"
      :custom-bg="customBg"
      :right="short"
      style="margin-bottom: 0"
    ></my-title>
    <transition name="extra-button">
      <div v-if="!control || value" class="extra-button">
        <slot name="extra-button"></slot>
      </div>
    </transition>
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
import { mapState } from 'vuex';

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
    initValue: {
      default: false
    },
    customBg: {
      type: String
    }
  },
  data() {
    return {
      value: this.initValue
    };
  },
  computed: {
    ...mapState(['short']),
  },
  mounted() {
    this.$emit('monuted', this);
  },
  methods: {
    click(v) {
      this.value = v;
      this.$emit('open', this);
    },
    close() {
      this.value = false;
    }
  }
};
</script>

<style lang="stylus" scoped>
.extra-button {
  position: absolute
  right: 0px
  left: 10px
  top: 36px
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
