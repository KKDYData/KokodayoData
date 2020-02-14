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
