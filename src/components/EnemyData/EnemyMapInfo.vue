<template>
  <div class="map-option-container-wrapper">
    <my-title v-if="showTitle" title="地图信息"></my-title>
    <div class="map-option-container">
      <content-slot
        class="map-option-content"
        :long="true"
        :no-wrap="true"
        :width="slotWidth"
        v-for="([k,v]) in options"
        :key="k"
      >
        <template slot="title">{{k}}</template>
        <template slot="content">
          <span :style="v > 100 ? 'font-size: 14px': ''">{{v == '999999' ? '0' : v}}</span>
        </template>
      </content-slot>
    </div>
  </div>
</template>

<script>
import MyTitle from '../MyTitle';
import ContentSlot from '../ContentSlot';

export default {
  components: {
    MyTitle,
    ContentSlot,
  },
  props: {
    options: {
      required: true
    },
    short: {
      required: true
    },
    showTitle: {
      default: true,
      type: Boolean
    }
  },
  data() {
    const cW = document.body.clientWidth;
    const slotWidth = cW < 375 ? 121 : 126;
    return {
      slotWidth
    };
  }
};
</script>

<style lang="stylus" scoped>
.map-option-container-wrapper {
  margin-left: 5vw
  max-width: 450px
  min-width: 385px
}

.map-option-container {
  display: flex
  justify-content: space-between
  flex-wrap: wrap
  align-content: start
  margin-left: 10px
}

.map-option-content {
  margin: 0 0 20px
  width: calc(50% - 40px)
}

@media screen and (max-width: 1000px) {
  .map-option-container-wrapper {
    min-width: auto
    max-width: inherit
    margin: 0 0 20px 2vw
  }

  .map-option-container {
    min-width: auto
  }

  .map-option-content {
    margin: 0 10px 10px 0
    width: calc(50% - 10px)
  }
}

@media screen and (max-width: 800px) {
  .map-option-container-wrapper {
    margin: 0
  }

  .map-option-content {
    margin: 0 10px 10px 0
  }

  .map-option-container {
    margin-left: 0
  }
}
</style>
