<template>
  <div>
    <nav-menu></nav-menu>

    <EditingHomePanel v-if="load" :serverData="data"></EditingHomePanel>
  </div>
</template>
<script>
import EditingHomePanel from './components/EditingHomePanel';
import { getNameList, sortByTime, getHeroData } from './components/utils';
import NavMenu from './NavMenu';

export default {
  components: {
    EditingHomePanel,
    'nav-menu': NavMenu
  },
  data() {
    return {
      load: false,
      data: []
    };
  },
  mounted() {
    this.getData().then(data => {
      this.data = data;
      this.load = true;
    });
  },
  methods: {
    getData() {
      return getNameList().then(source => {
        let sortedData = sortByTime(source);
        this.$set(this, 'data', sortedData);
        const downloadQueue = new TaskQueue(10);
        return new Promise(resolve => {
          let completed = 0;
          source.forEach(p => {
            let task = () => {
              return getHeroData(p.url).then(data => {
                // p = Object.assign({}, p);
                this.$set(p, 'data', data);
                if (++completed === source.length) {
                  resolve(source);
                }
              });
            };
            downloadQueue.pushTask(task);
          });
        });
      });
    }
  }
};

class TaskQueue {
  constructor(concurrency) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }

  pushTask(task) {
    this.queue.push(task);
    this.next();
  }

  next() {
    while (this.running < this.concurrency && this.queue.length) {
      const task = this.queue.shift();
      task().then(() => {
        this.running--;
        this.next();
      });
      this.running++;
    }
  }
}
</script>
