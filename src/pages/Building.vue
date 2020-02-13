<template>
  <div class="building-wrapper-outter" :class="short ? 'mobile': 'normal'">
    <h1>building</h1>

    <div class="building-wrapper">
      <div v-for="(data, key) in skills" :key="key">
        <div class="building-item">
          <div class="building-title">
            <div v-if="1 || !simple" class="building-title-pic">
              <c-image :src="getPic(key)" />
            </div>
            <div class="building-title-name">{{ data.name }}</div>
          </div>
          <build-panel :simple="simple" :building="data.skills" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getBuildingList } from '../utils/fetch'
import BuildPanel from '@/components/DetailsLayout/BuildingData'
import { getProfilePath } from '../utils'
import CImage from '@/components/base/CImage'
import { mapState } from 'vuex'

export default {
  components: {
    BuildPanel,
    CImage
  },
  data() {
    return {
      skills: null,
      agents: null,
    }
  },
  computed: {
    ...mapState(['short']),
    simple() {
      return true
    }
  },
  async created() {
    this.skills = await getBuildingList()
  },
  methods: {
    getPic(key) {
      return getProfilePath(key, true)
    }
  }
}
</script>

<style lang="stylus">
@import './styl/Building'
</style>
