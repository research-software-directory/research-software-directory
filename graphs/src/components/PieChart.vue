<template>
  <div id="chart"></div>
</template>
<style>
.pie {
  margin: 20px;
}

svg {
  float: left;
}

.legend {
  float: left;
  font-family: "Verdana";
  font-size: 0.7em;
}

.pie text {
  font-family: "Verdana";
  fill: #000;
  margin: 20px;
}

.pie .name-text {
  font-size: 0.8em;
}

.pie .value-text {
  font-size: 3em;
}
</style>
<script>
import * as d3 from "d3";
const margin = { top: 20, right: 0, bottom: 30, left: 40 };

export default {
  name: "PieChart",
  props: {
    data: null
  },
  data() {
    return {
      toolsWithMentions: [],
      mentions: [],
      count: 0,
      mention: []
    };
  },

  methods: {
    getData() {
      this.data.map(el => {
        this.toolsWithMentions.push({
          name: el.brandName,
          mentions: el.related.mentions
        });
      });
      this.toolsWithMentions.map(el => {
        return this.mentions.push({
          name: el.name,
          types: el.mentions.map(elem => {
            return elem.foreignKey.type;
          })
        });
      });
      this.mentions = this.mentions.map(el => {
        return { name: el.name, mentionTypes: this.countType(el.types) };
      });
      this.mention = this.mentions.filter(el => {
        if (el.name === "GGIR") {
          return el;
        }
      });

      this.drawChart(this.mention[0].mentionTypes, this.mention[0].name);
    },
    countType(types) {
      var counts = {};
      for (var i = 0; i < types.length; i++) {
        var type = types[i];
        if (counts[type] === undefined) {
          counts[type] = 1;
        } else {
          counts[type] = counts[type] + 1;
        }
      }
      return counts;
    },
    drawChart(data, title) {
      data = Object.keys(data).map(function(key) {
        return { name: key, value: data[key] };
      });

      var text = "";

      var width = 400;
      var height = 430;
      var thickness = 40;
      var duration = 750;
      var padding = 10;
      var opacity = 0.8;
      var opacityHover = 1;
      var otherOpacityOnHover = 0.8;
      var tooltipMargin = 13;

      var radius = Math.min(width - padding, height - padding) / 2;
      var color = d3.scaleOrdinal(d3.schemeCategory10);

      var svg = d3
        .select("#chart")
        .append("svg")
        .attr("class", "pie")
        .attr("width", width)
        .attr("height", height);

      var chart_title = svg.append("text");
      chart_title
        .attr("x", width / 2)
        .attr("y", margin.top)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text(title);
      var g = svg
        .append("g")
        .attr(
          "transform",
          "translate(" + width / 2 + "," + (height / 2 + 20) + ")"
        );

      var arc = d3
        .arc()
        .innerRadius(0)
        .outerRadius(radius);

      var pie = d3
        .pie()
        .value(function(d) {
          return d.value;
        })
        .sort(null);
      g.selectAll("path")
        .data(pie(data))
        .enter()
        .append("g")
        .append("path")
        .attr("d", arc)
        .attr("fill", (d, i) => color(i))
        .style("opacity", opacity)
        .style("stroke", "white")
        .on("mouseover", function(d) {
          d3.selectAll("path").style("opacity", otherOpacityOnHover);
          d3.select(this).style("opacity", opacityHover);

          let g = d3
            .select("svg")
            .style("cursor", "pointer")
            .append("g")
            .attr("class", "tooltip")
            .style("opacity", 0);

          g.append("text")
            .attr("class", "name-text")
            .text(`${d.data.name} (${d.data.value})`)
            .attr("text-anchor", "middle");

          let text = g.select("text");
          let bbox = text.node().getBBox();
          let padding = 2;
          g.insert("rect", "text")
            .attr("x", bbox.x - padding)
            .attr("y", bbox.y - padding)
            .attr("width", bbox.width + padding * 2)
            .attr("height", bbox.height + padding * 2)
            .style("fill", "white")
            .style("opacity", 0.75);
        })
        .on("mousemove", function() {
          let mousePosition = d3.mouse(this);
          let x = mousePosition[0] + width / 2;
          let y = mousePosition[1] + height / 2 - tooltipMargin;

          let text = d3.select(".tooltip text");
          let bbox = text.node().getBBox();
          if (x - bbox.width / 2 < 0) {
            x = bbox.width / 2;
          } else if (width - x - bbox.width / 2 < 0) {
            x = width - bbox.width / 2;
          }

          if (y - bbox.height / 2 < 0) {
            y = bbox.height + tooltipMargin * 2;
          } else if (height - y - bbox.height / 2 < 0) {
            y = height - bbox.height / 2;
          }

          d3.select(".tooltip")
            .style("opacity", 1)
            .attr("transform", `translate(${x}, ${y})`);
        })
        .on("mouseout", function() {
          d3.select("svg")
            .style("cursor", "none")
            .select(".tooltip")
            .remove();
          d3.selectAll("path").style("opacity", opacity);
        })
        .on("touchstart", function() {
          d3.select("svg").style("cursor", "none");
        })
        .each(function(d, i) {
          this._current = i;
        });

      let legend = d3
        .select("#chart")
        .append("div")
        .attr("class", "legend")
        .style("margin-top", "30px");

      let keys = legend
        .selectAll(".key")
        .data(data)
        .enter()
        .append("div")
        .attr("class", "key")
        .style("display", "flex")
        .style("align-items", "center")
        .style("margin-right", "20px");

      keys
        .append("div")
        .attr("class", "symbol")
        .style("height", "10px")
        .style("width", "10px")
        .style("margin", "5px 5px")
        .style("background-color", (d, i) => color(i));

      keys
        .append("div")
        .attr("class", "name")
        .text(d => `${d.name} (${d.value})`);

      keys.exit().remove();
    }
  },
  mounted() {
    this.getData();
  }
};
</script>
