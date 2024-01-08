// Set up the SVG dimensions
var margin = { top: 30, right: 70, bottom: 90, left: 100 },
		width = 900 - margin.left - margin.right,
		height = 625 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#streamgraph")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          `translate(${margin.left}, ${margin.top})`);

// Parse the Data
d3.csv("data/story2/streamgraph/prova.csv").then( function(data) {

  // List of groups = header of the csv files
  const keys = data.columns.slice(1)

  // Add X axis
  const x = d3.scaleBand()
    .domain(data.map(d => d.Age))
    .range([0, width])
    .padding(0.1);
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(5));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([-1000000, 1000000])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // color palette
  const color = d3.scaleOrdinal()
    .domain(keys)
    .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#888888', '#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854'])

  //stack the data?
  const stackedData = d3.stack()
    .offset(d3.stackOffsetSilhouette)
    .keys(keys)
    (data)

  // Show the areas
  svg.selectAll("mylayers")
    .data(stackedData)
    .join("path")
      .style("fill", function(d) { return color(d.key); })
      .attr("d", d3.area()
        .x(function(d, i) { return x(d.data.Age); })
        .y0(function(d) { return y(d[0]); })
        .y1(function(d) { return y(d[1]); })
    )

})
