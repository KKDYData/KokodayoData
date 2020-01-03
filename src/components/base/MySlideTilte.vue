<template>
  <div class="my-slide-title-wrapper">
    <slot name="const-content" />

    <my-title
      ref="title"
      :title="title"
      :custom-bg="customBg"
      :right="short"
      style="margin-bottom: 0"
      control
      :state="active"
      @click="click"
    />
    <transition name="extra-button">
      <div v-if="active" class="extra-button">
        <slot name="button" />
      </div>
    </transition>
    <div class="content-wrapper">
      <el-collapse-transition>
        <slot v-if="active" />
      </el-collapse-transition>
    </div>
  </div>
</template>

<script>
import MyTitle from './MyTitle';
import Vue from 'vue';
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
Vue.component(CollapseTransition.name, CollapseTransition);
// todo change short get from props
// import { mapState } from 'vuex';

export default {
  components: { MyTitle },
  props: {
    title: {
      required: true,
      type: String
    },
    control: {
      type: Boolean,
      default: true
    },
    init: {
      type: Boolean,
      default: false
    },
    customBg: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      value: this.init,
      lock: false,
      short: false
    };
  },

  computed: {
    // ...mapState(['short']),
    active() {
      if (!this.control) return true;
      else return this.value;
    }
  },
  watch: {
    value(v) {
      if (!v && this.$refs.title.value) {
        this.lock = true;
        this.$refs.title.click();
      }
    }
  },
  created() {
    console.log('what');
  },
  mounted() {
    this.$emit('monuted', this);
    console.log('slide', this.value);

  },
  methods: {
    initClick(v) {
      this.value = v;
      this.$refs.title.click();
    },
    click(v) {
      if (this.lock) {
        this.lock = false;
        return;
      }
      console.log(v);
      this.value = !v;
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

  & + .my-slide-title-wrapper {
    margin-top: 20px
  }

  .content-wrapper {
    will-change: height
    position: relative
    overflow: hidden
    box-sizing: border-box
    padding: 20px 10px 10px
  }
}

@media screen and (min-width: 700px) {
  .extra-button {
    left: auto
    right: 20px
  }
}
</style>
