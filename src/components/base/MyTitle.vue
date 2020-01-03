<template>
  <div class="title-container" :style="{background}">
    <div v-if="!right && control" :class="{active: state, 'control-button': true}" @click="click">
      <div class="control-border" />
    </div>
    <div class="title">{{ title }}</div>
    <div
      v-if="right && control"
      :class="{active: state, 'control-button': true, right: true}"
      @click="click"
    >
      <div class="control-border" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SlideTitle',
  props: {
    right: {
      type: Boolean,
      default: false
    },
    title: {
      required: true,
      type: String
    },
    control: {
      type: Boolean,
      default: false
    },
    customBg: {
      type: String,
      default: '#414141'
    },
    state: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    background() {
      return this.customBg;
    }
  },
  methods: {
    click() {
      //  不是很好看
      /**
       * @property {boolean} value - 控制器状态
       */
      this.$emit('click', this.state);
    }
  }
};
</script>

<style lang="stylus" scoped>
//test stylint
.title-container {
  font-weight: bold
  color: white
  margin-bottom: 20px
  padding-left: 20px
  box-shadow: 1px 1px 1px 0px rgba(0, 0, 0, 0.15)
  display: flex
  font-size: 0
  height: 20px
  border-radius: 2px

  &:hover {
    .control-border {
      &:before, &:after {
        opacity: 1
      }

      &:before {
        top: 50%
        left: 100%
      }

      &:after {
        top: -60%
        left: -100%
      }
    }
  }
}

.active {
  .control-border {
    &:before, &:after {
      opacity: 1
    }

    &:before {
      top: 70%
      left: 80%
    }

    &:after {
      top: -60%
      left: -80%
    }
  }

  &.control-button {
    &:before {
      transform: rotate(90deg)
    }

    &:after {
      transform: scaleX(0.8)
    }
  }
}

.title {
  line-height: 1
  padding-top: 2px
  font-size: 18px
}

.control-border {
  --bwidth: 5px

  &:before, &:after {
    transition: all 0.3s ease 0.2s
    opacity: 0
    position: absolute
    content: ''
    width: 20px
    height: 20px
    border: #313131 solid
    box-sizing: border-box
  }

  &:before {
    top: -60%
    left: -100%
    border-width: 0 var(--bwidth) var(--bwidth) 0
  }

  &:after {
    top: 70%
    left: 100%
    border-width: var(--bwidth) 0 0 var(--bwidth)
  }
}

.control-button {
  margin-right: 30px
  position: relative
  cursor: pointer
  width: 20px
  height: 20px
  z-index: 1

  &.right {
    margin-left: auto
  }

  &:before, &:after {
    position: absolute
    top: calc(50% - 2px)
    left: -25%
    content: ''
    width: 30px
    height: 4px
    background-color: #ffffff
    transition: all 0.3s
    transform-origin: center
  }
}
</style>
