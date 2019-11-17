<template>
  <el-carousel
    class="char-set-panel"
    :height="height"
    :autoplay="false"
    indicator-position="outside"
    :loop="false"
    @change="$event => curIndex = $event"
  >
    <!-- 默认立绘小人 pc -->
    <spine-panel v-if="!short && !ex" :id="id" :canvas-width="spineWidth" />

    <div v-for="(data, index) in setData" :key="index" :data="data" :short="short">
      <!-- pc 皮肤小人 -->
      <spine-panel
        v-if="!short && curIndex === index && setData && ex"
        :id="data.avatarId"
        class="spin-panel"
        :canvas-width="spineWidth"
      />

      <!-- 立绘 -->
      <el-carousel-item :key="index" style="font-size:13px">
        <div class="char-set-container-wrapper">
          <div v-if="data.displaySkin">
            <div class="char-set-info-cotainer">
              <content-slot style="margin-top: 10px" :long="true" :no-wrap="true">
                <template slot="title">系列</template>
                <template slot="content">{{ data.displaySkin.skinGroupName }}</template>
              </content-slot>
              <content-slot style="margin-top: 10px" :long="true" :no-wrap="true">
                <template slot="title">获得方式</template>
                <template slot="content">{{ data.displaySkin.obtainApproach }}</template>
              </content-slot>
              <content-slot style="margin-top: 10px" :long="true" :no-wrap="true">
                <template slot="title">描述</template>
                <template slot="content">{{ data.displaySkin.usage }}</template>
              </content-slot>
              <content-slot style="margin-top: 10px;" :long="true" :no-wrap="true">
                <template slot="title">记录</template>
                <template slot="content">{{ data.displaySkin.content | filterColor }}</template>
              </content-slot>
            </div>
          </div>
          <div>
            <el-image class="char-set-container" :src="data.charSet">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
          </div>
          <div v-if="!short" class="set-right-panel">
            <div class="char-profile-container">
              <el-image :src="data.profile" />
            </div>
            <div class="char-half-container">
              <el-image :src="data.halfPic" />
            </div>
          </div>

          <!-- 默认立绘小人 移动 -->
          <!-- <el-carousel-item> -->
          <spine-panel
            v-if="short && setData && !ex"
            :id="id"
            class="spin-panel mobile"
            :canvas-width="spineWidth"
          />
          <!-- </el-carousel-item> -->
          <!-- 皮肤立绘小人 移动 -->
          <spine-panel
            v-if="short && setData && ex"
            :id="data.avatarId"
            class="spin-panel mobile"
            :canvas-width="spineWidth"
          />
        </div>
      </el-carousel-item>
    </div>
  </el-carousel>
</template>

<script>
const SpinePanel = () =>
  import(/* webpackChunkName: "SpinePanel" */ '../SpinePanel');
import ContentSlot from '../ContentSlot';
import { Carousel, CarouselItem } from 'element-ui';
import Vue from 'vue';
import { mapState } from 'vuex';
import { getScreenWidth } from '../../../utils';
Vue.use(Carousel);
Vue.use(CarouselItem);

export default {
  components: {
    SpinePanel,
    ContentSlot,
  },
  filters: {
    filterColor(v) {
      const reg = /<color (name=(.{7}))?>/g;
      const regL = /<\/color>/g;
      return v.replace(reg, '').replace(regL, '');
    }
  },
  props: {
    id: {
      type: String,
      default: null
    },
    setData: {
      required: true,
      type: Array
    }
  },

  data() {
    return {
      curIndex: 0,
      width: 1159,
      height: '1000px',
      spineWidth: 300
    };
  },

  computed: {
    ...mapState(['short']),
    ex() {
      return this.setData[0].displaySkin;
    },
  },
  beforeMount() {
    const { width, height } = getScreenWidth();
    this.height = (height - 100) + 'px';
    if (!this.short) {
      this.spineWidth = (width / 1159) * 300;
    }
  },

  methods: {

  }
};
</script>

<style lang="stylus" scoped>
.char-set-panel {
  &>>> .el-carousel__item {
    display: flex
    justify-content: center
    align-items: center
  }
}

.char-set-container-wrapper {
  display: flex
  justify-content: space-between
  height: 100%
  width: 100%
}

.char-set-container {
  width: 58vw
}

.char-set-info-cotainer {
  width: 20vw
}

.char-half-container {
  width: 110px
  position: relative
  margin-top: 20px
  font-size: 0
}

.char-profile-container {
  height: 110px
  position: relative
}

.char-profile-container + .char-half-container, .char-profile-container {
  &::before {
    content: ''
    position: absolute
    width: 100%
    height: 100%
    top: 0
    left: 0
    border: 10px solid #fff
    box-sizing: border-box
    box-shadow: 0px 2px 4px 1px rgba(0, 0, 0, 0.31), 0px 2px 6px 0px rgba(0, 0, 0, 0.47) inset
  }
}

.set-right-panel {
  margin-right: 10px
  width: 110px
  display: flex
  flex-flow: column
}

.spine-panel {
  position: absolute
  bottom: 0
  left: 0
}

.spin-panel.mobile {
  position: relative
  display: flex
  justify-content: center
}

@media screen and (max-width: 700px) {
  .char-set-container-wrapper {
    display: block
    height: 100%
  }

  .char-set-container {
    width: 100%
  }

  .char-set-panel {
    &>>> .el-carousel__item {
      overflow: scroll
    }
  }

  .set-right-panel {
    margin-right: 10px
    width: auto
    display: flex
    flex-flow: column
  }

  .char-set-info-cotainer {
    width: 100%
  }
}
</style>
