<template>
  <div class="right-panel">
    <my-slide-title
      v-if="data"
      ref="layout-control"
      :control="mapCode ? true : false"
      :title="selectedMap === '' ? '所有敌人' : '出现敌人'"
    >
      <div slot="extra-button">
        <el-button
          v-if="!simpleShow && mapCode"
          size="mini"
          type="danger"
          class="clear-route-button"
          @click="clearRoutes"
        >清空路线</el-button>
        <el-button
          v-if="mapCode"
          size="mini"
          type="info"
          :plain="simpleShow ? false: true"
          @click="simpleShow = !simpleShow"
        >
          <i class="el-icon-refresh" />
          {{ simpleShow ? '简要显示': '路线模式' }}
        </el-button>
        <el-tooltip v-if="mapCode && !simpleShow">
          <el-button type="info" size="mini">说明</el-button>
          <div slot="content">
            <p>假设这波开始的时间是2分10秒, 敌人延迟4秒，间隔30</p>
            <p>在上面地图方块中出现X秒的意思是</p>
            <p>会在这个标出时间的方块上停留X秒</p>
            <p>延迟4s，就是这个敌人2分14秒的时候出发</p>
            <p>数量2，间隔30秒</p>
            <p>就是2分44秒之后会有第2个一样的敌人也走这一条线路</p>
          </div>
        </el-tooltip>
      </div>
      <!-- 不能用margin会影响动画，margin合并 -->
      <enemy-data-layout
        v-if="!load && data"
        ref="layout"
        :style="short && !mapCode? 'margin-top: -10px':'padding-top: 20px'"
        :data="data"
        :map-data="selMapData"
        :runes-mode="runesMode"
        :simple-show="simpleShow"
        @showRoute="loopRoutes"
        @closeRoute="loopRoutes"
      />
    </my-slide-title>
    <my-slide-title v-if="short && mapCode" title="地图信息">
      <enemy-map-info
        style="margin-top: 20px"
        :show-title="false"
        :options="options"
        :global-buffs="globalBuffs"
        :wave-time="waveTime"
      />
    </my-slide-title>
    <my-slide-title v-if="mapCode && showPredefine && preData" title="地图预设">
      <map-pre-defined
        style="margin-top: 10px"
        :pre-data="selMapData.predefines"
        :data="preData"
        :runes-data="runesMode ? selMapData.runes : null"
      />
    </my-slide-title>
    <!-- 一不小心吧silde写到dropList里面了，不过效果一样，不管了 -->
    <map-drop-list
      v-if="mapCode && detailsDropList.length > 0"
      style="margin-top: 20px"
      :drop-info="detailsDropList"
      :target-stage="mapCode"
    />
  </div>
</template>

<script>
export default {

};
</script>
