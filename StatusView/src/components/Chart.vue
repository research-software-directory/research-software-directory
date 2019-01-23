<template></template>
<style>
.toolTip {
  position: absolute;
  display: none;
  padding: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  border-radius: 2px;
  text-align: center;
}
</style>
<script>
import * as d3 from "d3";
const margin = { top: 20, right: 0, bottom: 30, left: 40 };
const height = 500;

export default {
  name: "Chart",
  props: {
    loaded: false,
    data: null,
    type: ""
  },
  data() {
    return {
      width: 500
    };
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
        .range([0, this.width])
        .paddingInner(0.3)
        .paddingOuter(0.3);

      var y = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(this.data, d => {
            return d.value;
          })
        ])
        .range([height, 0]);
      return { x, y };
    },
    drawChart() {
      const scale = this.getScales();
      var chartArea = this.$el.parentElement;
      var tooltip = d3
        .select("#" + chartArea.id)
        .append("div")
        .attr("class", "toolTip");

      var svg = d3
        .select("#" + chartArea.id)
        .append("svg")
        .attr("width", this.width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
      var g = svg
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      g.append("text")
        .attr("class", "x axis label")
        .attr("x", this.width / 2)
        .attr("y", height + 30)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .text(this.type);
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
          return scale.y(d.value);
        })
        .attr("width", scale.x.bandwidth)
        .attr("height", d => {
          return height - scale.y(d.value);
        })
        .attr("fill", "orange")
        .on("mousemove", d => {
          return tooltip
            .style("left", d3.event.pageX - 50 + "px")
            .style("top", d3.event.pageY - 70 + "px")
            .style("display", "inline-block")
            .html(d.brandName + "<br/>" + d.value);
        })
        .on("mouseout", () => {
          tooltip.style("display", "none");
        });
    },

    handleResize() {
      if (window.innerWidth < 550) {
        this.width = 300;
      }
    }
  },
  mounted() {
    this.drawChart();
  },
  created() {
    window.addEventListener("resize", this.handleResize.bind(this));
    this.handleResize();
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize.bind(this));
  }
};
</script>
