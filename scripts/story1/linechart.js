// set the dimensions and margins of the graph
var margin = { top: 60, right: 70, bottom: 70, left: 100 },
	           width = 1435 - margin.left - margin.right,
	           height = 650 - margin.top - margin.bottom;

// Create a tooltip
const tooltip = d3.select("#linechart_1")
                  .append("section")
                    .attr("id", "linechart_tooltip")
                  .style("opacity", 0)
                  .style("background-color", "lightgray")
                  .style("border", "2px solid black")
                    .attr("class", "tooltip");
