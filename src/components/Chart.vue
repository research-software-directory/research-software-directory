<template>
  <div id="chart-area"></div>
</template>

<script>
import * as d3 from "d3";
const margin = { top: 20, right: 0, bottom: 30, left: 40 };
const height = 500;
const width = 700;
export default {
  name: "Chart",
  props: {
    loaded: false,
    data: null
  },

  watch: {
    loaded(isloaded) {
      if (isloaded) {
        this.drawChart();
      }
    }
  },
  methods: {
    getScales() {
      var x = d3
        .scaleBand()
        .domain(
          this.data.map(d => {
            return d.brandName;
          })
        )
        .range([0, width])
        .paddingInner(0.3)
        .paddingOuter(0.3);

      var y = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(this.data, d => {
            return d.totalCommits;
          })
        ])
        .range([height, 0]);
      return { x, y };
    },
    drawChart() {
      const scale = this.getScales();
      console.log(d3.select("#chart-area"));

      var svg = d3
        .select("#chart-area")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
      var g = svg
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      //X label
      g.append("text")
        .attr("class", "x axis label")
        .attr("x", width / 2)
        .attr("y", height + 140)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .text("Tools");
      var xAxisCall = d3.axisBottom(scale.x).tickSize(0);
      xAxisCall.tickFormat((domain, number) => {
        return "";
      });
      g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxisCall);

      var yAxisCall = d3.axisLeft(scale.y);
      g.append("g")
        .attr("class", "y axis")
        .call(yAxisCall);

      var bars = g.selectAll("rect").data(this.data);
      bars
        .enter()
        .append("rect")
        .attr("x", (d, i) => {
          return scale.x(d.brandName);
        })
        .attr("y", d => {
          return scale.y(d.totalCommits);
        })
        .attr("width", scale.x.bandwidth)
        .attr("height", d => {
          return height - scale.y(d.totalCommits);
        })
        .attr("fill", "orange");

      console.log(this.loaded, this.data);
    }
  }
};
</script>
<style scoped>
#chart-area {
  width: 50%;
  height: 100%;
}
</style>