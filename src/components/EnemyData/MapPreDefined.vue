<template>
  <div v-loading="lock">
    <map-predefined-list
      class="predefine-list-contianer"
      title="预设道具"
      :list="tokenList"
      :statusToChFc="statusToChFc"
    ></map-predefined-list>
    <map-predefined-list class="predefine-list-contianer" title="预下场角色" :list="characterInstsList"></map-predefined-list>
    <map-predefined-list
      class="predefine-list-contianer"
      title="预设角色卡"
      :list="characterCardsList"
      :show-position="false"
    ></map-predefined-list>
    <map-predefined-list
      class="predefine-list-contianer"
      title="道具卡"
      :list="tokenCardList"
      :runes-data="runesData"
      :show-position="false"
    ></map-predefined-list>
  </div>
</template>

<script>
import { getProfilePath, isMobliePad, preDefineCompute } from '../../utils';
import { statusToChToken } from '../../utils/string';
import MapPredefinedList from './MapPreDefinedList';



export default {
  props: {
    preData: {
      required: true
    },
    short: {
      default: false
    },
    data: {
      required: true
    },
    runesData: {
      default: Object
    }

  },
  components: {
    MapPredefinedList
  },
  data() {
    return {
      tokenInsts: null,
      tokenCards: null,
      characterInsts: null,
      characterCards: null,
      statusToChFc: statusToChToken,
      skills: null,
      detailsOpen: false,
      isHover:
        process.env.NODE_ENV === 'development' || isMobliePad() ||
          this.short ? 'click' : 'hover',
      lock: false
    };
  },
  computed: {
    tokenList() {
      return preDefineCompute(this.data.tokenInsts, this.preData.tokenInsts);
    },
    tokenCardList() {
      return preDefineCompute(this.data.tokenCards, this.preData.tokenCards);
    },
    characterInstsList() {
      return preDefineCompute(this.data.characterInsts, this.preData.characterInsts);
    },
    characterCardsList() {
      return preDefineCompute(this.data.characterCards, this.preData.characterCards);
    },
  },
  methods: {
    getSrc(key) {
      return getProfilePath(key);
    },
  }

};
</script>

<style lang="stylus" scoped>
.predefine-list-contianer + .predefine-list-contianer {
  margin-top: 30px
}
</style>
