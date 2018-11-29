<template>
  <div id="list">
    <section class="columns">
      <div
        v-for="(item, i) in charts"
        :key="item.id"
        :id="item.id"
        class="column"
        draggable="true"
        @dragstart="dragStart(i, $event)"
        @dragover.prevent
        @dragenter="dragEnter"
        @dragleave="dragLeave"
        @dragend="dragEnd"
        @drop="dragFinish(i, $event)"
      >
        <span class="remove-item" @click="removeItem(item)">x</span>
        <Chart :type="item.type" :data="item.data"></Chart>
      </div>
    </section>
  </div>
</template>





<style scoped>
* {
  box-sizing: border-box;
}
.columns {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  margin: 5px 0;
}

.column {
  flex: 1;
  border: 1px solid gray;
  margin: 2px;
  padding: 10px;
  cursor: move;
}
.remove-item {
  float: right;
  color: #a45;
  opacity: 0.5;
}

.column:hover .remove-item {
  opacity: 1;
  font-size: 28px;
  cursor: pointer;
}
</style>
<script>
import Chart from "./Chart.vue";
export default {
  name: "List",
  components: {
    Chart
  },
  props: {
    loaded: Boolean,
    data: null
  },
  data() {
    return {
      commits: [],
      contributors: [],
      mentions: [],
      releases: [],
      charts: null,
      dragging: -1
    };
  },
  computed: {
    isDragging() {
      return this.dragging > -1;
    }
  },
  watch: {
    loaded(isloaded) {
      debugger;
      if (isloaded) {
        this.getData();
        this.sortData();
        this.setCharts();
      }
    }
  },
  methods: {
    setCharts() {
      this.charts = [
        {
          id: "commit-chart",
          type: "Commits",
          data: this.commits
        },
        {
          id: "contributes-chart",
          type: "Contributors",
          data: this.contributors
        },
        {
          id: "mentions-chart",
          type: "Mentions",
          data: this.mentions
        },
        {
          id: "releases-chart",
          type: "Releases",
          data: this.releases
        }
      ];
    },
    getData() {
      this.data.map((el, i) => {
        this.contributors.push({
          brandName: el.brandName,
          value: el.contributors.length
        });
        this.commits.push({
          brandName: el.brandName,
          value: el.totalCommits
        });

        this.mentions.push({
          brandName: el.brandName,
          value: el.related.mentions.length
        });
        this.releases.push({
          brandName: el.brandName,
          value: el.releases.length
        });
      }, this);
    },
    sortData() {
      this.commits = this.commits.sort((a, b) => b.value - a.value);
      this.contributors = this.contributors.sort((a, b) => b.value - a.value);
      this.mentions = this.mentions.sort((a, b) => b.value - a.value);
      this.releases = this.releases.sort((a, b) => b.value - a.value);
    },
    dragStart(which, ev) {
      ev.dataTransfer.setData("Text", this.id);
      ev.dataTransfer.dropEffect = "move";
      this.dragging = which;
    },
    removeItemAt(index) {
      this.charts.splice(index, 1);
    },
    removeItem(item) {
      this.charts.splice(this.charts.indexOf(item), 1);
    },
    dragEnter(ev) {},
    dragLeave(ev) {},
    dragFinish(to, ev) {
      this.moveItem(this.dragging, to);
      ev.target.style.marginTop = "2px";
      ev.target.style.marginBottom = "2px";
    },
    dragEnd(ev) {
      this.dragging = -1;
    },
    moveItem(from, to) {
      if (to === -1) {
        this.removeItemAt(from);
      } else {
        this.charts.splice(to, 0, this.charts.splice(from, 1)[0]);
      }
    },
    reset() {
      this.setCharts();
    }
  },
  mounted() {
    debugger;

    this.getData();
    this.sortData();
    this.setCharts();
  }
};
</script>

