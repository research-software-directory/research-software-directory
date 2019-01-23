<template>
  <div id="app">
    <div class="container">
      <p>Research Software Directory</p>
      <div class="shadow">
        <PieChart v-if="loaded" :data="data"></PieChart>
        <List v-if="loaded" :data="data"></List>
        <Spinner v-else></Spinner>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Spinner from "./components/Spinner.vue";
import List from "./components/List.vue";
import PieChart from "./components/PieChart.vue";
var margin = { left: 100, right: 10, top: 10, bottom: 150 };
export default {
  name: "App",
  components: {
    List,
    Spinner,
    PieChart
  },
  data() {
    return {
      data: null,
      loaded: false
    };
  },
  methods: {
    getData() {
      axios
        .get("https://www.research-software.nl/api/software_cache")
        .then(response => {
          this.data = response.data;
          this.loaded = true;
        });
    }
  },
  mounted() {
    this.getData();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.shadow {
  display: flex;
  box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 5px 8px 0 rgba(0, 0, 0, 0.14),
    0 1px 14px 0 rgba(0, 0, 0, 0.12);
}
.container p {
  text-align: center;
  font-family: "Akkurat", Helvetica, arial, sans-serif;
  font-size: 2rem;
  color: #00a3e3;
}
</style>
