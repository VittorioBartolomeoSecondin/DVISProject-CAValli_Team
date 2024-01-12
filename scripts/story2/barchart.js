// Set up the SVG dimensions
var margin = { top: 30, right: 70, bottom: 90, left: 100 },
		        width = 750 - margin.left - margin.right,
		        height = 650 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#barchart")
  .append("svg")
    .attr("id", "barchart_svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Parse the Data
d3.csv("data/story2/barcharts/barchart_AUT.csv").then( function(data) {

  // Filter out data points for the relevant year
  data = data.filter(d => d.year === 2009);

  // Extract unique categories for the x-axis
  const categories = [...new Set(data.map(d => d.category))];
  console.log(categories);
  
  // X axis
  const x = d3.scaleBand()
    .range([ 0, width])
    .domain(categories)
    .padding(0.2);
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-180)")
      .style("text-anchor", "end");
  
  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, 100])
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));
  
  // Bars
  svg.selectAll("mybar")
    .data(category => data.filter(d => d.category === category))
    .join("rect")
      .attr("x", d => x(d.category))
      .attr("y", d => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.value))
      .attr("fill", "#69b3a2")

})
