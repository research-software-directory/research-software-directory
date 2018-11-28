<template>
  <div id="app">
    <div class="status_chart">
      <p>Status Chart Goes Here!</p>
      <div class="shadow">
        <List>
          <Chart :loaded="loaded" :data="data"></Chart>
        </List>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Chart from "./components/Chart.vue";
import List from "./components/List.vue";
var margin = { left: 100, right: 10, top: 10, bottom: 150 };
export default {
  name: "App",
  components: {
    List,
    Chart
  },
  data() {
    return {
      data: [],
      loaded: false
    };
  },
  methods: {
    getData() {
      axios
        .get("https://www.research-software.nl/api/software_cache")
        .then(response => {
          this.data = response.data.sort(
            (a, b) => b.totalCommits - a.totalCommits
          );
          this.loaded = true;
        });
    }
  },
  created() {
    this.getData();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.status_chart {
  margin: 30px;
}
.shadow {
  box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 5px 8px 0 rgba(0, 0, 0, 0.14),
    0 1px 14px 0 rgba(0, 0, 0, 0.12);
}
</style>
