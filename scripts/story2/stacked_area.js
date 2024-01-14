// Set up the SVG dimensions
/*var margin = { top: 30, right: 70, bottom: 90, left: 100 },
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
  const sumstat = d3.group(data, d => d.year);

  // Transform data to the expected format
  const formattedData = Array.from(sumstat, ([year, values]) => ({
    year: year,
    "percentage of NEETs with disability": values.find(d => d.type === "percentage of NEETs with disability").value,
    "percentage of NEETs without disability": values.find(d => d.type === "percentage of NEETs without disability").value,
  }));

  // Stack the data: each group will be represented on top of each other
  const mygroups = ["percentage of NEETs with disability", "percentage of NEETs without disability"] // list of group names
  const mygroup = [1,2] // list of group names
  const stackedData = d3.stack()
    .keys(mygroups)
    .value((d, key) => d[key])
    (formattedData);

  // Add X axis --> it is a date format
  const x = d3.scaleLinear()
    .domain(d3.extent(formattedData, (d) => +d.year))
    .range([0, width]);
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format("d")));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, 100])
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y).tickFormat((d) => (d === 0 ? d : d + "%")));

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
        .x(function (d, i) { return x(+d.data.year); })
        .y0(function(d) { return y(d[0]); })
        .y1(function(d) { return y(d[1]); })
    )
})*/

// Assuming you have an SVG container with an id "barChart"
const svg = d3.select("#stacked_area");

// Assuming you have the dataset loaded into a variable called "data"

// Set up dimensions
const margin = { top: 20, right: 30, bottom: 30, left: 40 };
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create scales
const x = d3.scaleBand().range([0, width]).padding(0.1);
const y = d3.scaleLinear().range([height, 0]);

// Create axes
const xAxis = d3.axisBottom(x);
const yAxis = d3.axisLeft(y);

// Group data by year
const groupedData = d3.group(data, d => d.year);

// Extract types (with and without disability)
const types = Array.from(new Set(data.map(d => d.type)));

// Set the domain for the x and y scales
x.domain(Array.from(groupedData.keys()));
y.domain([0, d3.max(data, d => +d.value)]);

// Append the bars
svg.append("g")
    .selectAll("g")
    .data(groupedData)
    .enter().append("g")
    .attr("transform", d => `translate(${x(d[0])},0)`)
    .selectAll("rect")
    .data(d => types.map(type => ({ key: type, value: d[1].find(e => e.type === type).value })))
    .enter().append("rect")
    .attr("x", d => x.bandwidth() / 2 * (types.indexOf(d.key) - 0.5))
    .attr("y", d => y(d.value))
    .attr("width", x.bandwidth() / 2)
    .attr("height", d => height - y(d.value))
    .attr("fill", d => (d.key === "percentage of NEETs with disability") ? "steelblue" : "orange");

// Append the x-axis
svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis);

// Append the y-axis
svg.append("g")
    .call(yAxis);
