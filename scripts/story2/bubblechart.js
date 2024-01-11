// Set up the SVG dimensions
var margin = { top: 30, right: 70, bottom: 90, left: 100 },
		      width = 750 - margin.left - margin.right,
		      height = 650 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("bubblechart")
  .append("svg")
    .attr("id", "bubblechart_svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

//Read the data
d3.csv("data/story2/bubblechart/bubblechart.csv").then( function(data) {

  // Add X axis
  const x = d3.scaleLinear()
    .domain([0, 100])
    .range([0, width]);
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, 100])
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add a scale for bubble size
  const z = d3.scaleLinear()
    .domain([1000, 1000000000])
    .range([5, 100]);

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .join("circle")
      .attr("cx", d => x(d.leavers))
      .attr("cy", d => y(d.poverty))
      .attr("r", d => z(d.neet))
      .style("fill", "#69b3a2")
      .style("opacity", "0.7")
      .attr("stroke", "black")

})
