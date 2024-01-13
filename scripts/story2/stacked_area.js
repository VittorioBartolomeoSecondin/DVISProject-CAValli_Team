// Set up the SVG dimensions
var margin = { top: 30, right: 70, bottom: 90, left: 100 },
    width = 750 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#stacked_area")
  .append("svg")
    .attr("id", "stacked_area_svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          `translate(${margin.left}, ${margin.top})`);

//Read the data
d3.csv("data/story2/areachart.csv").then( function(data) {

  // group the data: one array for each value of the X axis.
  const sumstat = d3.group(data, d => d.year, d => d.type);

  // Stack the data: each group will be represented on top of each other
  const mygroups = ["percentage of NEETs with disability", "percentage of NEETs without disability"] // list of group names
  const mygroup = [1,2] // list of group names
  const stackedData = d3.stack()
    .keys(mygroup)
    .value((d, key) => +d.get(key).value)
    (sumstat);

  // Add X axis --> it is a date format
  const x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return +d.year; }))
    .range([0, width]);
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(5));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return +d.value; })*1.2])
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // color palette
  const color = d3.scaleOrdinal()
    .domain(mygroups)
    .range(['#e41a1c','#377eb8'])

  // Show the areas
  svg
    .selectAll("mylayers")
    .data(stackedData)
    .join("path")
      .style("fill", function (d) { return color(d.key); })
      .attr("d", d3.area()
        .x(function (d, i) { return x(+d.data[0].year); })
        .y0(function(d) { return y(d[0]); })
        .y1(function(d) { return y(d[1]); })
    )
})
