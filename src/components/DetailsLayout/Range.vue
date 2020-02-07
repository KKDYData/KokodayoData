<template>
  <div v-if="girdTable" class="gird-container" :style="containerWidth">
    <div v-for="row in rows" :key="row" class="gird-row">
      <div v-for="col in cols" :key="col" :style="style" :class="rangeHit(row, col)">
        <!-- <div :class>{{row}} : {{col}} {{}} |</div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { getRange } from '../../utils/fetch'
import { sort } from '../../utils'
import { mapState } from 'vuex'

export default {
  props: ['rangeId', 'data'],

  data() {
    return {
      isRotate: false,
      rangeData: null,
      isData: false
    }
  },
  computed: {
    ...mapState(['short']),
    containerWidth() {
      const width =
        this.cols.length > 2 ? 'auto' : 50 * this.cols.length + 'px'
      return {
        width: width
      }
    },
    rows() {
      return this.girdTable.rows
    },
    cols() {
      return this.girdTable.cols
    },
    girdTable() {
      const data = this.data ? this.data : this.rangeData
      if (!data) return
      const rowsArr = sort([...data.grids], (a, b) => a.row > b.row),
        colsArr = sort([...data.grids], (a, b) => a.col > b.col),
        rows = [],
        cols = []
      for (
        let i = rowsArr[rowsArr.length - 1].row;
        i < rowsArr[0].row + 1;
        i++
      ) {
        rows.push(i)
      }
      for (
        let i = colsArr[colsArr.length - 1].col;
        i < colsArr[0].col + 1;
        i++
      ) {
        cols.push(i)
      }
      return {
        rows: rows,
        cols: cols
      }
    },
    style() {
      const width = this.isRotate ? 1 / Math.min(this.girdTable.rows.length, this.girdTable.cols.length)
        : 1 / Math.max(this.girdTable.rows.length, this.girdTable.cols.length)
      return {
        width: this.short ? `${50 * (width * 0.8)}vw` : `${width * 80}% `,
        borderWidth: this.short ? `${50 * 0.05 * width}vw` : `${width * 12} px`,
        margin: this.short ? `${50 * 0.05 * width}vw` : `${width * 8} px`
      }
    },
  },
  watch: {
    async rangeId(v) {
      this.rangeData = await getRange(this.rangeId)
    }
  },
  async mounted() {
    if (this.rangeId) {
      this.rangeData = await getRange(this.rangeId)
    }
  },
  methods: {
    rangeHit(r, c) {
      const data = this.data ? this.data : this.rangeData

      if (this.isRotate) {
        let temp = c
        c = r
        r = temp
      }
      if (r === 0 && c === 0) return 'gird-col gird-hit'
      const t = data.grids.find(el => {
        return el.row === r && el.col === c
      })
      return t ? 'gird-col' : 'gird-col gird-none'
    },
  }
}
</script>

<style lang="stylus" scoped>
.gird-container {
  border-radius: 1px
  padding: 2px
  margin: 0 auto
  position: relative
}

.gird {
  &-row {
    padding: 0
    font-size: 0
    text-align: center
    word-break: keep-all
    white-space: nowrap
  }

  &-col {
    display: inline-block
    background-color: rgba(78, 78, 78, 0.5)
    border: 4px solid rgba(78, 78, 78, 0.5)
    margin: 2px
    box-sizing: border-box
    max-width: 50px
  }

  &-col::after {
    content: ''
    margin-top: 100%
    display: block
  }

  &-none {
    border: 2px solid transparent
    opacity: 0.23
  }

  &-hit {
    background-color: white
  }
}

@media screen and (max-width: 500px) {
  .gird-col {
    box-sizing: border-box
    max-width: 50px
  }
}
</style>
