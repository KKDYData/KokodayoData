<template>
  <div :class="classes" @click="clickHandler">
    <div v-if="data.path === '/'" class="route-animate">
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
    <div v-else class="route-item-text">{{ data.text }}</div>
  </div>
</template>
<script>
import { sleep, TaskQueue } from '../../utils'
export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      kkdy: 'kokodayo',
      animate: false,
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
        // {
        //   s: 'd',
        //   index: 4,
        //   class: 'k-s'
        // },
        // {
        //   s: 'a',
        //   index: 5,
        //   class: 'k-s'
        // },
        // {
        //   s: 'y',
        //   index: 6,
        //   class: 'k-s'
        // },
        // {
        //   s: 'o',
        //   index: 7,
        //   class: 'k-s'
        // },
      ]
    }

  },
  computed: {
    classes() {
      return 'route-item ' + (this.data.isHere ? 'is-here' : '')
    }
  },
  mounted() {
    setTimeout(() => {
      this.animate = true
      requestAnimationFrame(() => {
        this.loop()
      })
    }, 3000)
    // if (this.data.path === '/') {
    // }
  },
  methods: {
    clickHandler() {
      this.$emit('click')
    },
    async change(data, c, time) {
      this.$set(data, 'class', c)
      await sleep(time)
    },
    async loop() {
      const queue = new TaskQueue(1)
      this.KKDY.forEach((k, index) => {
        const task = () => this.change(k, 'k-big', 50)
        const re = () => this.change(k, 'k-n', 250)
        // const taskC = async () => {
        //   this.$set(k, 's', k.s.toUpperCase())
        // }
        queue.pushTask(task)
        // queue.pushTask(taskC)
        queue.pushTask(re)
      })
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

  &.is-here {
    color: rgb(255, 208, 75)

    .route-item-text, .route-animate {
      color: rgb(255, 208, 75)
    }
  }

  &-text {
    color: white
    font-size: 1em
    text-align: center
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
    //animation: fade-reverse 10s ease-in-out infinite
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
