<template>
  <div v-if="girdTable" class="gird-container" :style="containerWidth">
    <div class="gird-row" v-for="row in rows" :key="row">
      <div :style="width" :class="rangeHit(row, col)" v-for="col in cols" :key="col">
        <!-- <div :class>{{row}} : {{col}} {{}} |</div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { sort, fetchGet, path } from '../utils';

export default {
  async mounted() {
    if (this.rangeId) {
      this.rangeData = await this.getRangeById(this.rangeId);
    }
  },
  props: ['rangeId', 'data'],

  data() {
    return {
      isRotate: false,
      rangeData: null,
      isData: false
    };
  },
  computed: {
    containerWidth() {
      const width =
        this.cols.length > 2 ? 'auto' : 50 * this.cols.length + 'px';
      return {
        width: width
      };
    },
    rows() {
      return this.girdTable.rows;
    },
    cols() {
      return this.girdTable.cols;
    },
    girdTable() {
      const data = this.data ? this.data : this.rangeData;
      if (!data) return;
      const rowsArr = sort([...data.grids], (a, b) => a.row > b.row),
        colsArr = sort([...data.grids], (a, b) => a.col > b.col),
        rows = [],
        cols = [];
      for (
        let i = rowsArr[rowsArr.length - 1].row;
        i < rowsArr[0].row + 1;
        i++
      ) {
        rows.push(i);
      }
      for (
        let i = colsArr[colsArr.length - 1].col;
        i < colsArr[0].col + 1;
        i++
      ) {
        cols.push(i);
      }
      return {
        rows: rows,
        cols: cols
      };
    },
    width() {
      let width;
      if (this.isRotate) {
        width =
          1 / Math.min(this.girdTable.rows.length, this.girdTable.cols.length);
      } else {
        width =
          1 / Math.max(this.girdTable.rows.length, this.girdTable.cols.length);
      }
      return 'width: calc(' + width * 100 + '% - 4px)';
    }
  },
  methods: {
    rangeHit(r, c) {
      const data = this.data ? this.data : this.rangeData;

      if (this.isRotate) {
        let temp = c;
        c = r;
        r = temp;
      }
      if (r === 0 && c === 0) return 'gird-col gird-hit';
      const t = data.grids.find(el => {
        return el.row === r && el.col === c;
      });
      return t ? 'gird-col' : 'gird-col gird-none';
    },
    async getRangeById(id) {
      const data = await fetchGet(path + 'range/' + id + '.json');
      return data;
    }
  }
};
</script>

<style scoped>
.gird-container {
  position: relative;
  background-color: rgba(78, 78, 78, 0.5);
  border-radius: 1px;
  padding: 2px;
  margin: 0 auto;
}
.gird-row {
  padding: 0;
  font-size: 0;
  text-align: center;
}
.gird-col {
  display: inline-block;
  /* width: 20%; */
  border: 2px solid rgba(255, 255, 255, 0.897);
  margin: 2px;
  box-sizing: border-box;
  max-width: 50px;
}
.gird-col::after {
  content: "";
  margin-top: 100%;
  display: block;
}
.gird-none {
  border: 2px solid transparent;
}

.gird-hit {
  background-color: white;
}
</style>
