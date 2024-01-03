// set the dimensions and margins of the graph
var margin = { top: 60, right: 70, bottom: 70, left: 100 },
	           width = 1435 - margin.left - margin.right,
	           height = 650 - margin.top - margin.bottom;

// Create a tooltip
const tooltip = d3.select("#pyramid")
                  .append("section")
                    .attr("id", "pyramid_tooltip")
                  .style("opacity", 0)
                  .style("background-color", "lightgray")
                  .style("border", "2px solid black")
                    .attr("class", "tooltip");

var pyramid_svg;

d3.csv("/data/story1/pyramids/pyramid2009.csv).then(function(data) {
   
});
