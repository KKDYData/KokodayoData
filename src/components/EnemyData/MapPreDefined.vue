<template>
  <div>
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
      :show-position="false"
    ></map-predefined-list>
  </div>
</template>

<script>
import { getHeroData, calStatus, getProfilePath, path, fetchGet, isMobliePad } from '../../utils';
import { statusToChToken } from '../../utils/string';
import MapPredefinedList from './MapPreDefinedList';

const preDefineCompute = (asyncData, baseData) => {
  if (!asyncData || asyncData.length === 0) return;
  const res = baseData.map(el => {
    const key = el.inst.characterKey;
    const target = asyncData.find(item => key === item.key);
    if (!target) return;
    const { data, targetSkill } = target;
    const targetData = calStatus(el.inst.level, data.phases[el.inst.phase].attributesKeyFrames);
    return { key, targetData, targetSkill, ...data, ...el };
  });
  return res.filter(el => el);
};

const preDefineGet = async (key, baseData) => {
  const temp = baseData[key].reduce((res, cur) => res.add(cur.inst.characterKey), new Set());
  const res = await Promise.all([...temp].map(key => getHeroData(key).then(data => ({ key, data }))));
  for (const char of res) {
    const base = baseData[key].find(el => el.inst.characterKey === char.key);
    const targetSkill = char.data.skills[base.skillIndex];
    if (targetSkill) {
      const skillKey = targetSkill.skillId;
      char.targetSkill = [await fetchGet(path + 'skills/data/' + skillKey + '.json')];
    }
  }
  return res;
};

export default {
  props: {
    preData: {
      required: true
    },
    short: {
      default: false
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
          this.short ? 'click' : 'hover'
    };
  },
  async created() {
    this.getData();
  },
  watch: {
    async preData(v) {
      this.getData();

    }
  },
  computed: {
    tokenList() {
      return preDefineCompute(this.tokenInsts, this.preData.tokenInsts);
    },
    tokenCardList() {
      return preDefineCompute(this.tokenCards, this.preData.tokenCards);
    },
    characterInstsList() {
      return preDefineCompute(this.characterInsts, this.preData.characterInsts);
    },
    characterCardsList() {
      return preDefineCompute(this.characterCards, this.preData.characterCards);
    },
  },
  methods: {
    getSrc(key) {
      return getProfilePath(key);
    },
    async getData() {
      preDefineGet('tokenInsts', this.preData, this).then(res => this.tokenInsts = res);
      preDefineGet('tokenCards', this.preData, this).then(res => this.tokenCards = res);
      preDefineGet('characterInsts', this.preData, this).then(res => this.characterInsts = res);
      preDefineGet('characterCards', this.preData, this).then(res => this.characterCards = res);
    }
  }

};
</script>

<style lang="stylus" scoped>
.predefine-list-contianer + .predefine-list-contianer {
  margin-top: 30px
}
</style>
