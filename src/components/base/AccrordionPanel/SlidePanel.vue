<script>
import MySildeTitle from '@/components/Base/MySlideTilte'
import Emitter from '../utils/emmiter'

export default {
  mixins: [MySildeTitle, Emitter],
  props: {
    name: {
      type: String,
      requird: true,
      default: '?'
    }
  },
  inject: ['mutiSlide'],
  computed: {
    active() {
      return this.mutiSlide.activeName === this.name
    }
  },
  methods: {
    click(v) {
      // todo delete 
      if (this.lock) {
        this.lock = false
        return
      }
      this.value = v
      this.$emit('open', this)
      this.dispatch('AccordionPanel', 'item-click', this)
    },
  }
}
</script>
