// Set up the SVG dimensions
var margin = { top: 30, right: 70, bottom: 70, left: 100 },
	      width = 900 - margin.left - margin.right,
	      height = 625 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#lollipop")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Parse the Data
d3.csv("data/story2/lollipops/lollipop2009.csv").then( function(data) {
  
  // X axis
  const x = d3.scaleBand()
    .range([ 0, width ])
    .domain(data.map(function(d) { return d.name; }))
    .padding(1);
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");
  
  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, 13000])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));
  
  // Lines
  svg.selectAll("myline")
    .data(data)
    .enter()
    .append("line")
      .attr("x1", function(d) { return x(d.name); })
      .attr("x2", function(d) { return x(d.name); })
      .attr("y1", function(d) { return y(d.abundance); })
      .attr("y2", y(0))
      .attr("stroke", "grey")
  
  // Circles
  svg.selectAll("mycircle")
    .data(data)
    .join("circle")
      .attr("cx", function(d) { return x(d.name); })
      .attr("cy", function(d) { return y(d.abundance); })
      .attr("r", "4")
      .style("fill", "#69b3a2")
      .attr("stroke", "black")
})
