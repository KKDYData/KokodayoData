<template>
  <div class="building-wrapper-outter" :class="classMode">
    <my-share />
    <filter-group
      ref="tokenFilter"
      label="显示方式"
      :filters="modes"
      single
      default="agent"
      @filter="switchMode($event)"
    />
    <filter-group
      ref="tokenFilter"
      label="位置"
      :filters="skilltypes"
      single
      single-close
      @filter="switchData($event)"
    />
    <filter-group
      v-if="nowType"
      ref="tokenFilter"
      label="分类"
      :filters="nowType"
      @filter="switchType($event)"
    />
    <div v-if="mode === 'agent'" class="building-wrapper">
      <div v-for="(data) in skills" :key="data.key">
        <div class="building-item">
          <div class="building-title">
            <div v-if="1 || !simple" class="building-title-pic">
              <c-image :src="getPic(data.key)" />
            </div>
            <div class="building-title-name">{{ data.name }}</div>
            <div
              v-if="filter && data.skills.length > 1"
              class="building-title-control click"
              :class="{rotate: data.all}"
              @click="showAll(data)"
            >
              <i class="el-icon-arrow-down" />
            </div>
          </div>
          <build-panel
            :show-all="data.all"
            :filter="filter"
            :simple="simple"
            :building="data.skills"
          />
        </div>
      </div>
    </div>
    <div v-else class="building-wrapper">
      <div v-for="({data, list}) in list" :key="data.name">
        <div class="building-item">
          <build-panel :filter="filter" :simple="simple" :building="[[{data}]]" />
          <div class="building-list">
            <div v-for="({text, key}) in list" :key="key" class="building-list-item">
              <c-image :src="getPic(key)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getBuildingList } from '../utils/fetch'
import BuildPanel from '@/components/DetailsLayout/BuildingData'
import { getProfilePath, sort } from '../utils'
import CImage from '@/components/base/CImage'
import FilterGroup from '@/components/base/FilterButtonGroup'
import MyShare from '@/components/Share'
import { mapState } from 'vuex'

import room from '@/utils/data/room'

import './styl/Building'


const changeToFilters = (data) => Object.entries(room).reduce((res, [k, v]) => {
  res.push({ value: k, text: v.name })
  return res
}, [])

const modes = [
  { text: '按干员', value: 'agent' },
  { text: '按技能', value: 'skill' },
]

const types = {
  TRADING: [
    { text: '20%', value: '效率<@cc.vup>+20%' },
    { text: '25%', value: '效率<@cc.vup>+25%' },
    { text: '30%', value: '效率<@cc.vup>+30%' },
    { text: '35%', value: '效率<@cc.vup>+35%' },
    { text: '获取效率', value: '获取效率' },
    { text: '订单上限', value: '订单上限' },
    { text: '心情', value: '心情' },
    { text: '组队', value: '当与' },
  ],
  CONTROL: [
    { text: '订单效率', value: '订单效率' },
    { text: '心情', value: '心情' },
    { text: '加强会客室', value: '加强会客室' },
  ],
  POWER: [
    { text: '10%', value: '10%' },
    { text: '15%', value: '15%' },
    { text: '20%', value: '20%' },
  ],
  // 10%
  MANUFACTURE: [
    { text: '2%', value: '提供<@cc.vup>2%' },
    { text: '10%', value: '生产力<@cc.vup>+10%' },
    { text: '15%', value: '生产力<@cc.vup>+15%' },
    { text: '25%', value: '生产力<@cc.vup>+25%' },
    { text: '30%', value: '生产力<@cc.vup>+30%' },
    { text: '35%', value: '生产力<@cc.vup>+35%' },
    { text: '仓库容量', value: '仓库容量' },
    { text: '通用生产力', value: '，生产力' },
    { text: '源石', value: '源石' },
    { text: '贵金属', value: '贵金属' },
    { text: '心情', value: '心情' },
  ],
  DORMITORY: [
    { text: '所有干员', value: '所有干员的心情每小时恢复' },
    { text: '单人', value: '某个干员' },
    { text: '自己', value: '，自身心情' },
    { text: '目标', value: '目标是' },
  ],
  WORKSHOP: [
    { text: '精英材料', value: '精英材料' },
    { text: '任意类材料', value: '任意类材料' },
    { text: '基建材料', value: '基建材料' },
    { text: '技巧概要', value: '技巧概要' },
    { text: '芯片', value: '芯片' },
  ],
  HIRE: [
    { text: '20%', value: '20%' },
    { text: '30%', value: '30%' },
    { text: '40%', value: '40%' },
    { text: '45%', value: '45%' },
  ],
  TRAINING: [
    { text: '所有干员', value: '，干员' },
    { text: '辅助', value: '辅助' },
    { text: '术师', value: '术师' },
    { text: '医疗', value: '医疗' },
    { text: '先锋', value: '先锋' },
    { text: '近卫', value: '近卫' },
    { text: '狙击', value: '狙击' },
    { text: '重装', value: '重装' },
    { text: '特种', value: '特种' },
  ],
  MEETING: [
    { text: '20%', value: '线索搜集速度提升<@cc.vup>20%' },
    { text: '25%', value: '线索搜集速度提升<@cc.vup>25%' },
    { text: '莱茵生命', value: '莱茵生命' },
    { text: '企鹅物流', value: '企鹅物流' },
    { text: '黑钢国际', value: '黑钢国际' },
    { text: '乌萨斯学生自治团', value: '乌萨斯学生自治团' },
    { text: '格拉斯哥帮', value: '格拉斯哥帮' },
    { text: '喀兰贸易', value: '喀兰贸易' },
    { text: '罗德岛制药', value: '罗德岛制药' },
  ]
}
Object.values(room)
  .forEach(el => console.log(el.name))

export default {
  components: {
    BuildPanel,
    CImage,
    FilterGroup,
    MyShare
  },
  data() {
    return {
      skills: null,
      rawSkills: null,
      roomList: null,
      roomSkills: null,
      agents: null,
      filter: null,
      list: null,
      rawlist: null,
      mode: 'agent'
    }
  },
  computed: {
    ...mapState(['short']),
    classMode() {
      return this.short ? 'mobile' : 'pc'
    },
    simple() {
      return true
    },
    skilltypes() {
      return changeToFilters(room)
    },
    modes() {
      return modes
    },
    types() {
      return types
    },
    nowType() {
      return this.filter ? types[this.filter.value] : []
    }
  },
  async created() {
    const data = await getBuildingList().then((data => {
      const res = data.map(e => {
        e.all = false
        return e
      })
      return res
    }))
    this.rawSkills = data
    this.skills = data
    const rawlist = Object.values(data.reduce((res, cur) => {
      const { name, key, skills } = cur
      skills.forEach(skillGroup => {
        skillGroup.forEach(skill => {
          const { id, data } = skill
          if (!res[id]) {
            res[id] = { data, list: [{ name, key }] }
          } else {
            res[id].list.push({ name, key })
          }
        })
      })
      return res
    }, {}))
    this.list = rawlist
    this.rawlist = rawlist
  },
  methods: {
    getPic(key) {
      return getProfilePath(key, true)
    },
    switchMode(data) {
      this.mode = data[0].value
      if (this.filter)
        this.switchData([this.filter])
    },
    switchData(data) {

      if (!data.length) {
        this.skills = this.rawSkills
        this.list = this.rawlist
        this.filter = null
        return
      }

      const target = data[0]
      this.filter = target

      const getL = (arr) => arr[arr.length - 1]
      const getKey = arr => arr.find(el => el[0].data.roomType === target.value)
      const getLast = arr => getL(getKey(arr))
      const getNum = data => +/\d+/.exec(data.description)

      const filterSkill = (raw, target) => raw.filter(e =>
        e.skills.some(s =>
          s.some(i => i.data.roomType === target.value)))

      const sortSkill = raw => sort(raw, (pre, cur) => {
        const pSize = getNum(getLast(pre.skills))
        const curSize = getNum(getLast(cur.skills))
        return pSize > curSize
      })

      const filterList = (raw, target) => raw.filter(e => e.data.roomType === target.value)
      const sortList = raw => sort(raw, (pre, cur) => {
        const pSize = getNum(pre.data)
        const curSize = getNum(cur.data)
        return pSize > curSize
      })

      if (this.mode === 'agent') {
        const temp = sortSkill(filterSkill(this.rawSkills, target))
        this.skills = temp
        this.roomSkills = temp

      } else {
        const temp = sortList(filterList(this.rawlist, target))
        this.list = temp
        this.roomList = temp
      }

    },
    switchType(data) {
      if (!data.length) {
        this.skills = this.roomSkills
        this.list = this.roomList
        // if (this.mode === 'agent')
        // this.filter = null
        // this.switchData([this.filter])
        return
      }

      // const target = data[0]
      // this.filter = target
      const check = (e, target) => e.data.description.indexOf(target.value) > -1

      const getL = (arr) => arr[arr.length - 1]
      const getLast = arr => getL(arr)
      const getNum = data => +/\d+/.exec(data.description)

      const filterSkill = (raw, target) => raw.filter(e =>
        e.skills.some(s =>
          s.some(e => data.some(target => check(e, target)))))

      const sortSkill = raw => sort(raw, (pre, cur) => {
        const pSize = getNum(getLast(pre.skills))
        const curSize = getNum(getLast(cur.skills))
        return pSize > curSize
      })

      const filterList = (raw, target) => raw.filter(e => data.some(target => check(e, target)))
      const sortList = raw => sort(raw, (pre, cur) => {
        const pSize = getNum(pre.data)
        const curSize = getNum(cur.data)
        return pSize > curSize
      })

      if (this.mode === 'agent') {
        const temp = filterSkill(this.roomSkills, data)
        this.skills = sortSkill(temp)

      } else {
        const temp = filterList(this.roomList, data)
        this.list = sortList(temp)
      }
    },
    showAll(data) {
      this.$set(data, 'all', !data.all)
    }
  }
}
</script>

<style lang="stylus">
.building-wrapper-outter {
  margin: 20px auto
  max-width: 1500px
}
</style>
