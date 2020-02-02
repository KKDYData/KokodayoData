<template>
  <router-link :class="classes" :to="data.path">
    <div v-if="data.path === '/'" class="route-animate" @mouseover="hoverHandler">
      <transition name="fade">
        <div v-if="animate" class="route-animate-ani">
          <div v-for="s in KKDY" :key="s.index" :class="s.class + ' route-item-animate'">{{ s.s }}</div>
        </div>
        <div v-else class="route-animate-ani">
          <div class="route-item-animate route-item-text">{{ data.text }}</div>
        </div>
      </transition>
      <div />
    </div>
    <div v-else-if="!short" class="route-item-text" :title="data.decs">{{ data.text }}</div>
    <div v-else :class="'route-item-short ' + (right ? 'is-right' : '')">
      <div>{{ data.text }}</div>
      <div class="is-right">{{ data.decs }}</div>
    </div>
  </router-link>
</template>
<script>
import { sleep, TaskQueue, debounce } from '../../utils'
export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    short: {
      type: Boolean,
      default: false
    },
    right: {
      type: Boolean,
      default: false
    },
    top: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      kkdy: 'kokodayo',
      animate: false,
      hoverHandler: () => { },
      KKDY: [
        {
          s: 'Ko',
          index: 0,
          class: 'k-s'
        },
        {
          s: 'ko',
          index: 1,
          class: 'k-s'
        },
        {
          s: 'Da',
          index: 2,
          class: 'k-s'
        },
        {
          s: 'yo',
          index: 3,
          class: 'k-s'
        },
      ]
    }

  },
  computed: {
    isHere() {
      return this.$route.path === this.data.path
    },
    classes() {
      const arr = ['route-item']
      if (this.isHere) arr.push('is-here')
      if (this.short) arr.push('is-short')
      if (this.right) arr.push('is-right')
      if (this.top) arr.push('is-top')
      return arr.join(' ')
    }
  },
  mounted() {
    setTimeout(() => {
      requestAnimationFrame(() => {
        this.loop()
      })
    }, 3000)
    this.hoverHandler = debounce(() => {
      this.loop()
    }, 1000)
  },
  methods: {
    async change(data, c, time) {
      this.$set(data, 'class', c)
      await sleep(time)
    },
    async loop() {
      if (this.data.path !== '/' || this.animate === true) return
      const queue = new TaskQueue(1)
      this.animate = true
      this.KKDY.forEach((k, index) => {
        const task = () => this.change(k, 'k-big', 50)
        const re = () => this.change(k, 'k-n', 250)
        queue.pushTask(task)
        queue.pushTask(re)
      })
      if (this.short) return
      const reToArk = async () => {
        await sleep(3000)
        this.animate = false
      }
      queue.pushTask(reToArk)
    }
  }
}
</script>
<style lang="stylus" scoped>
.route-item {
  padding: 15px 0
  border-bottom: 3px solid
  color: #515151
  animation: border 0.3s ease-in-out
  position: relative
  cursor: pointer

  &:focus {
    outline: none
  }

  &:any-link {
    cursor: pointer
    text-decoration: none
  }

  &.is-here {
    color: rgb(255, 208, 75)

    .route-item-text, .route-animate {
      color: rgb(255, 208, 75)
    }
  }

  &-text {
    color: white
    font-size: 0.9em
    text-align: center
  }

  &.is-short {
    padding: vw(25) 0 vw(5)
    display: block

    &.is-top {
      padding: vw(25) vw(10) vw(15)
    }

    .route-item-text {
      text-align: left
    }

    .route-animate {
      justify-content: start
      align-items: center
      font-size: vw(40)
      height: vw(50)
      position: relative
    }
  }

  &-short {
    display: flex
    justify-content: space-between
    align-items: flex-end
    color: white
    font-size: vw(40)

    .is-right {
      font-size: vw(30)
    }
  }
}

.route-animate {
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
  display: flex
  align-items: center
  justify-content: center
  color: white

  .route-animate-ani, .route-animate-static {
    display: flex
    justify-content: center
    align-items: end
    height: 1.2em
  }

  .route-animate-static {
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    align-items: center
  }

  .route-item-animate {
    font-size: 1em
    width: 20px
    transition: all 0.3s linear
    padding-bottom: 0
    will-change: font-size padding width
    opacity: 0

    &.route-item-text {
      opacity: 1
      width: 100%
    }

    &.k-big {
      width: 27px
      font-size: 1.3em
      padding-bottom: 2px
      opacity: 0.3
    }

    &.k-n {
      width: 25px
      font-size: 1.05em
      padding-bottom: 0px
      opacity: 1
    }
  }
}

@keyframes fade {
  0% {
    opacity: 0
  }

  50% {
    opacity: 0
  }

  60% {
    opacity: 1
  }

  90% {
    opacity: 1
  }

  100% {
    opacity: 0
  }
}

@keyframes fade-reverse {
  0% {
    opacity: 1
  }

  50% {
    opacity: 1
  }

  60% {
    opacity: 0
  }

  90% {
    opacity: 0
  }

  100% {
    opacity: 1
  }
}
</style>
