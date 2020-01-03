<template>
  <div class="agent-card-container-wrapper">
    <el-card style=" margin-bottom: 20px; position: relative;">
      <div class="agent-card-container">
        <char-cube class="agent-card-pic" :style="`--logo-link: url(${logo})`" :src="profile"></char-cube>
        <div class="agent-card-title-wrapper">
          <div class="title-first">
            <div>
              <span class="agent-card-title-name">
                <span style="color: rgb(49, 49, 49);font-family:FZYaSong-H-GBK;">{{data.name}}</span>
                <span
                  style="font-size: 0.7em; color: rgb(150, 150, 150);font-weight: normal"
                >{{data.appellation}}</span>
              </span>
            </div>
            <div>
              <div class="agent-card-title-class">
                <el-image
                  v-if="professionPic"
                  class="agent-card-pro-pic"
                  :src="professionPic"
                  :details="data.name"
                >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
                <span style="font-family:FZYaSong-H-GBK;">{{ profession }}</span>
                <el-image class="agent-card-star-pic" :src="rarityPath" fit="contain"></el-image>
              </div>
              <div class="intro-2-wrapper">
                <span v-if="!descArrary" class="intro-2" v-html="desc"></span>
                <span v-else-if="desc.length > 1" v-html="desc[phases]" class="intro-2"></span>
                <span v-else v-html="desc[0]" class="intro-2"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="details-wrapper-fixed">
        <p class="intro-0">
          <span>{{data.itemUsage}}</span>
        </p>
        <p class="intro-1">
          <span>{{data.itemDesc}}</span>
        </p>
        <div class="char-camp-pic" :style="`--logo-link: url(${logo})`">
          <div class="agent-card-camp-container" v-if="data.team > -1">
            <div class="agent-card-camp-en">
              <span>{{team.teamKey.toUpperCase()}}</span>
            </div>
            <div class="agent-card-camp-chinese" :style="`background-color: #${team.color}`">
              <span
                :style="`padding: 0 5px;color: ${team.color !== 'ffffff' ? '#fff' : 'rgb(136,136,136)'}`"
              >{{team.teamName}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="agent-card-tags">
        <el-tag
          :size="short ? 'mini' :'medium'"
          effect="dark"
          type="info"
          v-for="tag in  data.tagList"
          :key="tag"
        >{{tag}}</el-tag>
      </div>
    </el-card>
  </div>
</template>


<script>
import { Card, Tag, Image, Popover } from 'element-ui';
import Vue from 'vue';
import { mapState } from 'vuex';
Vue.use(Card);
Vue.use(Tag);
Vue.use(Image);
Vue.use(Popover);

import Team from './handbook_team_table.json';
import {
  changeDesc,
  getDetailsProfilePath,
  changeAttackSpeed
} from '../../utils';

import { getClass_Chinese } from '../../utils/string';
import { path } from '../../utils/listVer';

import charCube from '../base/charCube';

export default {
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

  components: {
    charCube
  },
  computed: {
    ...mapState(['short']),
    profile() {
      return getDetailsProfilePath(this.$route.params.name);
    },
    professionPic() {
      if (this.data.profession === 'TOKEN') return;
      return (
        path +
        'others/icon_profession_' +
        this.data.profession.toLowerCase() +
        '_lighten.png'
      );
    },
    profession() {
      return getClass_Chinese(this.data.profession);
    },
    rarityPath() {
      return path + 'others/rarity_' + this.data.rarity + '_optimized.png';
    },
    desc() {
      if (!this.data.trait) return changeDesc(this.data.description);
      else if (this.data.trait.candidates) {
        return this.data.trait.candidates.map(el => {
          return changeAttackSpeed({
            description: el.overrideDescripton ? el.overrideDescripton : this.data.description,
            blackboard: el.blackboard
          });
        });
      }
    },
    descArrary() {
      return Array.isArray(this.desc);
    },
    logo() {
      return this.data.displayLogo ? path + 'logo/' + this.data.displayLogo + '_optimized.png' : '';
    },
    team() {
      return Team[this.data.team];
    }
  }
};
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
}

.agent-card-title-class span {
  font-size: 38px
  word-break: keep-all
  line-height: 40px
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

.intro-2-control {
  display: flex

  & >>> .el-button.is-circle {
    padding: 2px
  }
}

.intro-2-control-button {
  margin-left: 5px
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

.agent-card-pro-pic {
  vertical-align: middle
  width: 40px
  height: 40px
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
  }

  .agent-card-container-wrapper >>> .el-card__body {
    padding-bottom: 30px
  }

  .agent-card-title-class span {
    font-size: calc(15px + 0.5vw)
  }

  .agent-card-title-name {
    font-size: 20px
  }

  .agent-card-title-wrapper {
    margin-left: calc(100px + 5vw)
    z-index: 1
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

  .agent-card-pro-pic {
    vertical-align: middle
    width: 20px
    height: 20px
  }

  .agent-card-pic {
    display: inline-block
    width: calc(100px + 5vw)
    height: calc(100px + 5vw)
    font-size: 12px
    position: absolute
    /*position: relative;*/
    flex-shrink: 1
    flex-grow: 1
    top: -20px
    left: -20px
    vertical-align: middle
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

  .agent-card-star-pic {
    height: calc(15px + 0.5vw)
    width: auto
  }

  .intro-2-control {
    flex-direction: column

    & >>> .el-button.is-circle {
      padding: 2px
    }
  }
}
</style>

