<template>
  <div id="list">
    <section class="columns">
      <div class="column" id="commits-chart">
        <Chart type="commits" :data="commits" :loaded="loaded"></Chart>
      </div>
      <div class="column" id="contributes-chart">
        <Chart type="contributes" :data="contributors" :loaded="loaded"></Chart>
      </div>
      <div class="column" id="mentions-chart">
        <Chart type="mentions" :data="mentions" :loaded="loaded"></Chart>
      </div>
      <div class="column" id="demo-chart">
        <Chart type="contributes" :data="contributors" :loaded="loaded"></Chart>
      </div>
    </section>
  </div>
</template>




<!-- Add "scoped" attribute to limit CSS to this component only -->
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
}
.demo {
  width: 300px;
  background-color: brown;
  height: 700px;
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
    loaded: false,
    data: null
  },
  data() {
    return {
      commits: [],
      contributors: [],
      mentions: []
    };
  },
  watch: {
    loaded(isloaded) {
      if (isloaded) {
        this.getData();
        this.sortData();
      }
    }
  },
  methods: {
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
      }, this);
    },
    sortData() {
      this.commits = this.commits.sort((a, b) => b.value - a.value);
      this.contributors = this.contributors.sort((a, b) => b.value - a.value);
      this.mentions = this.mentions.sort((a, b) => b.value - a.value);
    }
  }
};
</script>

