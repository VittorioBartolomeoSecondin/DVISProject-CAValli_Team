// Set up the SVG dimensions
var margin = { top: 30, right: 70, bottom: 120, left: 100 },
		        width = 1200 - margin.left - margin.right,
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
  data = data.filter(d => d.year == 2009);

  // Extract unique categories for the x-axis
  const categories = [...new Set(data.map(d => d.category))];
  
  // X axis
  const x = d3.scaleBand()
    .range([0, width])
    .domain(categories)
    .padding(0.5);
	
  const xAxis = svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));
    
  xAxis.selectAll("text")
    .attr("transform", "translate(-13.5,0)rotate(-90)")
    .style("text-anchor", "end")
    .attr("dx", "-7px");

  // Remove ticks for each label
  xAxis.selectAll(".tick line").remove();
  
  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, 70])
    .range([height, 0]);
    
  const yAxis = svg.append("g")
    .call(d3.axisLeft(y).tickFormat((d) => (d === 0 ? d : d + "%")));
    
  svg.selectAll("line.grid-line")
    .data(y.ticks())
    .enter()
    .append("line")
    .attr("class", "grid-line")
    .attr("x1", 0)
    .attr("x2", width)
    .attr("y1", d => y(d))
    .attr("y2", d => y(d))
    .attr("stroke", "rgba(0, 0, 0, 0.3)");
  
  // Bars
  svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
      .attr("x", d => x(d.category))
      .attr("y", d => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.value))
      .attr("fill", "#69b3a2")
  
  const linesData_long = [
    { startX: x(categories[1]) + x.bandwidth() * 1.5, endX: x(categories[1]) + x.bandwidth() * 1.5 },
    { startX: x(categories[6]) + x.bandwidth() * 1.5, endX: x(categories[6]) + x.bandwidth() * 1.5 },
    { startX: x(categories[9]) + x.bandwidth() * 1.5, endX: x(categories[9]) + x.bandwidth() * 1.5 },
  ];
  const linesData_short = [
    { startX: 0, endX: 0 },
    { startX: width, endX: width },
  ];
  
  svg.append("g").selectAll("line")
    .data(linesData_long)
    .enter()
    .append("line")
    .attr("x1", d => d.startX)
    .attr("x2", d => d.endX)
    .attr("y1", -10)
    .attr("y2", height + 100)
    .attr("stroke", "black");

  svg.append("g").selectAll("line")
    .data(linesData_short)
    .enter()
    .append("line")
    .attr("x1", d => d.startX)
    .attr("x2", d => d.endX)
    .attr("y1", height)
    .attr("y2", height + 100)
    .attr("stroke", "black");

})
