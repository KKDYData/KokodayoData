<template>
  <div class="agent-card-container-wrapper">
    <el-card style=" margin-bottom: 20px; position: relative;">
      <div class="agent-card-container">
        <char-cube class="agent-card-pic" :style="`--logo-link: url(${logo})`" :src="profile" />
        <div class="agent-card-title-wrapper">
          <div class="title-first">
            <div>
              <span class="agent-card-title-name">
                <span style="color: rgb(49, 49, 49);font-family:FZYaSong-H-GBK;">{{ data.name }}</span>
                <span
                  style="font-size: 0.7em; color: rgb(150, 150, 150);font-weight: normal"
                >{{ data.appellation }}</span>
              </span>
            </div>
            <div>
              <div class="agent-card-title-class">
                <div v-if="professionPic" class="agent-card-pro-pic">
                  <div class="image-inner" :style="{backgroundImage: `url('${professionPic}')`}" />
                </div>
                <span style="font-family:FZYaSong-H-GBK; margin-left: 3px">{{ profession }}</span>
                <div class="agent-card-star-pic">
                  <div class="image-inner" :style="{backgroundImage: `url('${rarityPath}')`}" />
                </div>
              </div>
              <div class="intro-2-wrapper">
                <span v-if="!descArrary" class="intro-2" v-html="desc" />
                <span v-else-if="desc.length > 1" class="intro-2" v-html="desc[phases - 1]" />
                <span v-else class="intro-2" v-html="desc[0]" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="details-wrapper-fixed">
        <p class="intro-0">
          <span>{{ data.itemUsage }}</span>
        </p>
        <p class="intro-1">
          <span>{{ data.itemDesc }}</span>
        </p>
        <div class="char-camp-pic" :style="`--logo-link: url(${logo})`">
          <div v-if="data.team > -1" class="agent-card-camp-container">
            <div class="agent-card-camp-en">
              <span>{{ team.teamKey.toUpperCase() }}</span>
            </div>
            <div class="agent-card-camp-chinese" :style="`background-color: #${team.color}`">
              <span
                :style="`padding: 0 5px;color: ${team.color !== 'ffffff' ? '#fff' : 'rgb(136,136,136)'}`"
              >{{ team.teamName }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="agent-card-tags">
        <el-tag
          v-for="tag in data.tagList"
          :key="tag"
          :size="short ? 'mini' :'medium'"
          effect="dark"
          type="info"
        >{{ tag }}</el-tag>
      </div>
    </el-card>
  </div>
</template>


<script>
import { Card, Tag } from 'element-ui'
import Vue from 'vue'
import { mapState } from 'vuex'
Vue.use(Card)
Vue.use(Tag)

import Team from './handbook_team_table.json'
import {
  changeDesc,
  getDetailsProfilePath,
  changeAttackSpeed
} from '../../utils'

import { getClass_Chinese } from '../../utils/string'
import { path } from '../../utils/listVer'

import charCube from '../base/charCube'

export default {

  components: {
    charCube
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    phases: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapState(['short']),
    profile() {
      return getDetailsProfilePath(this.$route.params.name)
    },
    professionPic() {
      if (this.data.profession === 'TOKEN') return
      return (
        path +
        'others/icon_profession_' +
        this.data.profession.toLowerCase() +
        '_lighten.png'
      )
    },
    profession() {
      return getClass_Chinese(this.data.profession)
    },
    rarityPath() {
      return path + 'others/rarity_' + this.data.rarity + '_optimized.png'
    },
    desc() {
      if (!this.data.trait) return changeDesc(this.data.description)
      else if (this.data.trait.candidates) {
        return this.data.trait.candidates.map(el => {
          console.log(this.data)
          return changeAttackSpeed({
            description: el.overrideDescripton ? el.overrideDescripton : this.data.description,
            blackboard: el.blackboard,
            type: this.data.name
          })
        })
      } else return ''
    },
    descArrary() {
      return Array.isArray(this.desc)
    },
    logo() {
      return this.data.displayLogo ? path + 'logo/' + this.data.displayLogo + '_optimized.png' : ''
    },
    team() {
      return Team[this.data.team]
    }
  }
}
</script>

<style lang="stylus" scoped>
.agent-card-container {
  display: flex
  align-items: stretch
  align-self: stretch
  position: relative
  height: 150px
  z-index: 1
}

.agent-card-title-class {
  font-size: 0
  display: flex
  align-items: center

  span {
    font-size: 38px
    word-break: keep-all
    line-height: 40px
  }

  .agent-card-pro-pic {
    vertical-align: middle
    width: 40px
    height: 40px
  }

  .agent-card-star-pic {
    height: 40px
    width: 200px
  }
}

.agent-card-title-wrapper {
  margin-left: 20px
}

.agent-card-title-name {
  font-size: 50px
  margin: 0
}

.intro-1, .intro-0 {
  margin: 0
  font-size: 14px
  position: absolute
  right: 0
  bottom: -10%
  z-index: 1
  bottom: 5%
  color: rgb(168, 168, 168)
}

.intro-0 {
  position: relative
  bottom: 0%
  padding-top: 20px
}

.intro-2-wrapper {
  display: flex
  align-items: center
  margin: 5px 0
}

.intro-2 {
  font-size: 14px
  bottom: 20%
}

.char-camp-pic {
  position: absolute
  width: 200px
  height: 200px
  right: 20px
  top: -20px
  z-index: 0
  display: flex
  align-items: center
  justify-content: flex-end
}

.char-camp-pic::before {
  content: ''
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
  opacity: 0.4
  z-index: -1
  background-size: contain
  background-image: var(--logo-link)
}

.agent-card-tags {
  position: absolute
  right: 0
  top: 0
  font-size: 0
}

.agent-card-tags span + span {
  margin-left: 5px
}

.agent-card-tags span {
  border-radius: 2px
}

.agent-card-tags > .el-tag--dark {
  background-color: #414141
  border-color: #414141
}

.details-wrapper-fixed {
  z-index: 0
}

.agent-card-camp-container {
  border-radius: 3px
  font-size: 0
  box-shadow: rgba(82, 82, 82, 0.4) 1px 1px 1px 1px
  border: 1px solid rgb(82, 82, 82)
  width: auto
  right: 0
  display: flex
  flex-wrap: nowrap
  align-items: center
}

.agent-card-camp-chinese span, .agent-card-camp-en span {
  font-size: 1.5rem
  word-break: keep-all
}

.agent-card-camp-en span {
  padding: 0 5px
}

@media screen and (max-width: 700px) {
  .agent-card-container {
    min-height: calc(90px + 2vw)
    height: auto
    flex-grow: 0

    .agent-card-title-wrapper {
      margin: 0
      position: relative
      z-index: 1
      flex: 1
    }
  }

  .agent-card-pic {
    display: inline-block
    width: calc(100px + 5vw)
    height: calc(100px + 5vw)
    font-size: 12px
    flex-shrink: 1
    position: relative
    top: -20px
    left: -20px
  }

  .agent-card-title-class {
    display: flex
    align-items: center

    span {
      font-size: calc(15px + 0.5vw)
    }

    .agent-card-pro-pic {
      vertical-align: middle
      width: 20px
      height: 20px
    }

    .agent-card-star-pic {
      height: calc(15px + 0.5vw)
      flex: 1
      margin-right: auto
      width: min-content
    }
  }

  .agent-card-container-wrapper >>> .el-card__body {
    padding-bottom: 30px
  }

  //??
  .agent-card-title-class, .agent-card-title-name {
    font-size: 20px
  }

  .details-wrapper-fixed {
    margin-top: 10px
  }

  .intro-0 span, .intro-1 span, .intro-2 {
    font-size: 13px
    background-color: rgba(255, 255, 255, 0.8)
  }

  .intro-0 {
    left: -15px
    font-size: 13px
    padding: 0
    position: relative
  }

  .intro-1 {
    left: -15px
    font-size: 12px
    position: relative
    padding-top: 10px
  }

  .agent-card-camp-chinese {
    box-shadow: rgba(82, 82, 82, 0.4) 0px 0px 2px 0px
    border-top-right-radius: 3px
    border-bottom-right-radius: 3px
  }

  .char-camp-pic {
    width: 150px
    height: 150px
    right: 5px
    bottom: 0px
    top: auto
    align-items: flex-end
  }

  .agent-card-camp-chinese span, .agent-card-camp-en span {
    font-size: 1rem
  }

  .char-camp-pic::before {
    opacity: 0.4
  }
}
</style>

