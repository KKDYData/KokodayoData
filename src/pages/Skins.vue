<template>
  <div class="skins-panel">
    <div v-if="groups">
      <filter-button-group :filters="groups" label="分类" @filter="switchData" />
      <div class="skin-wrapper">
        <div v-for="skin in skinsData" :key="skin.avatarId">
          <f-s size="90%" placement="left" :width="width" trigger="click" :arrow="false">
            <set-panel
              v-if="skin.avatarId === showId"
              :id="skin.avatarId"
              :set-data="[skin]"
              @blur="showId=''"
            />
            <div slot="reference" class="char-half-container" @click="showId = skin.avatarId">
              <c-image :src="skin.halfPic" fit="contain" />
            </div>
          </f-s>
          <div
            v-if="!short"
            style="text-align: center; margin-bottom: 20px"
          >{{ skin.displaySkin.skinName }}</div>
        </div>
        <div class="char-half-container fill" />
        <div class="char-half-container fill" />
        <div class="char-half-container fill" />
      </div>
    </div>

    <loading v-else />
  </div>
</template>

<script>
import store from '../store'
import { mapState } from 'vuex'
import FilterButtonGroup from '../components/base/FilterButtonGroup'
import Loading from '../components/base/Loading'
import { getSkinsData, getScreenWidth } from '../utils'
import SetPanel from '../components/base/SetPanel'
import CImage from '@/components/base/CImage'
import FS from '@/components/base/FullScreen'

store.dispatch('setExtraSkins')

export default {
  components: {
    FilterButtonGroup,
    Loading,
    SetPanel,
    CImage,
    FS
  },
  data() {
    return {
      filteredData: null,
      filters: [],
      showId: '',
      width: 1200
    }
  },
  computed: {
    ...mapState(['extraSkins', 'short']),
    skinsData() {
      if (!this.extraSkins) return []
      else
        return this.extraSkins
          .map(el => getSkinsData.skins(el))
          .filter(({ displaySkin }) => {
            if (!this.filters.length) return true
            return this.filters.find(
              ({ key }) => key === displaySkin.skinGroupName
            )
          })
    },
    groups() {
      if (!this.extraSkins) return []
      const set = new Set(
        this.extraSkins.map(({ displaySkin }) => displaySkin.skinGroupName)
      )
      return [...set].map(el => ({ key: el, text: el }))
    }
  },
  mounted() {
    console.log(this.extraSkins)
    this.width = getScreenWidth().width
  },
  methods: {
    switchData(e) {
      console.log(e)
      this.filters = e
    },
  }
}
</script>

<style lang="stylus" scoped>
@import '../styles/char.styl'

.skins-panel {
  margin: 20px
}

.skin-wrapper {
  display: flex
  flex-wrap: wrap
}

.char-half-container {
  margin: 10px
}

@media screen and (max-width: 700px) {
  .skins-panel {
    margin: 20px 0
  }

  .skin-wrapper {
    display: flex
    flex-wrap: wrap
    justify-content: space-between
    justify-content: space-around
  }

  .char-half-container {
    margin: 5px
  }
}

.fill {
  height: 0

  &:before, &:after {
    display: none
  }
}
</style>
