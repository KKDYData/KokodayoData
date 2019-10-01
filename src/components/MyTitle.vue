<template>
  <div class="group-container-title" :style="customBg">
    <div
      v-if="!short && control"
      @click="$emit('update:value', !value)"
      :class="{active: value, 'control-button': true}"
    >
      <div class="control-border"></div>
    </div>
    <div class="title">{{title}}</div>
    <div
      v-if="short && control"
      @click="$emit('update:value', !value)"
      :class="{active: value, 'control-button': true}"
    >
      <div class="control-border"></div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    title: {
      required: true,
      type: String
    },
    value: {
      type: Boolean
    },
    control: {
      default: false
    },
    customBg: {
      tyep: String,
      default: '--custombg: #414141'
    }
  },
  computed: {
    ...mapState(['short']),
  }
};
</script>

<style lang="stylus" scoped>
.group-container-title {
  font-weight: bold
  color: white
  margin-bottom: 20px
  padding-left: 20px
  box-shadow: 1px 1px 1px 0px rgba(0, 0, 0, 0.15)
  display: flex
  font-size: 0
  height: 20px
  border-radius: 2px
  background: var(--custombg)

  .title {
    line-height: 1
    padding-top: 2px
    font-size: 18px
  }

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
  }
}

.control-border {
  --bwidth: 5px

  &:before, &:after {
    transition: all 0.3s ease
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
  //margin-left: 5px
  margin-right: 30px
  position: relative
  cursor: pointer
  width: 20px
  height: 20px
  z-index: 1

  //background-color: green
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

.active.control-button:before {
  transform: rotate(90deg)
}

.active.control-button:after {
  transform: scaleX(0.8)
}

@media screen and (max-width: 700px) {
  .group-container-title {
    padding-left: 7vw
  }

  .control-button {
    margin-left: auto
  }
}
</style>
