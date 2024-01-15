// Set up the SVG dimensions
var margin = { top: 30, right: 70, bottom: 90, left: 100 },
    width = 750 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
const radius = Math.min(width, height) / 2 - margin;

// append the svg object
const svg = d3.select("#pie_chart")
  .append("svg")
  .attr("id", "pie_chart_svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", `translate(${width/2}, ${height/2})`);

// Create data
//const data = {a: 7.8, b: 29.8, c:22, d:6.8, e:15.4, f:5.8, g:12.5}
const data = {a: 7, b: 29, c:22, d:6, e:15, f:5, g:16}

// set the color scale
const color = d3.scaleOrdinal()
  .range(["#259C1F", "#20EACC", "#6608CA", "#EFE50D", "#a05d56", "#FF5733","#FF9E00"])

// Compute the position of each group on the pie:
const pie = d3.pie()
  .value(function(d) {return d[1]})
const data_ready = pie(Object.entries(data))
console.log(data_ready);

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
svg
  .selectAll('whatever')
  .data(data_ready)
  .join('path')
  .attr('d', d3.arc()
    .innerRadius(0)
    .outerRadius(radius)
  )
  .attr('fill', function(d){ return(color(d.data[1])) })
  .attr("stroke", "black")
  .style("stroke-width", "2px")
  .style("opacity", 0.7)
