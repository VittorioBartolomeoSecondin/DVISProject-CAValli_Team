// set the dimensions and margins of the graph
/*var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#boxplot")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Read the data and compute summary statistics for each specie
d3.csv("data/story2/boxplot.csv", function(data) {

  // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
  var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
    .key(function(d) { return d.country;})
    .rollup(function(d) {
      q1 = d3.quantile(d.map(function(g) { return g.value;}).sort(d3.ascending),.25)
      median = d3.quantile(d.map(function(g) { return g.value;}).sort(d3.ascending),.5)
      q3 = d3.quantile(d.map(function(g) { return g.value;}).sort(d3.ascending),.75)
      interQuantileRange = q3 - q1
      min = q1 - 1.5 * interQuantileRange
      max = q3 + 1.5 * interQuantileRange
      return({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})
    })
    .entries(data)

  // Show the X scale
  var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(data.map(function(d) { return d.country; }).filter(function(value, index, self) { return self.indexOf(value) === index; }))
    .paddingInner(1)
    .paddingOuter(.5)
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))

  // Show the Y scale
  var y = d3.scaleLinear()
    .domain([3,9])
    .range([height, 0])
  svg.append("g").call(d3.axisLeft(y))

  // Show the main vertical line
  svg
    .selectAll("vertLines")
    .data(sumstat)
    .enter()
    .append("line")
      .attr("x1", function(d){return(x(d.key))})
      .attr("x2", function(d){return(x(d.key))})
      .attr("y1", function(d){return(y(d.value.min))})
      .attr("y2", function(d){return(y(d.value.max))})
      .attr("stroke", "black")
      .style("width", 40)

  // rectangle for the main box
  var boxWidth = 100
  svg
    .selectAll("boxes")
    .data(sumstat)
    .enter()
    .append("rect")
        .attr("x", function(d){return(x(d.key)-boxWidth/2)})
        .attr("y", function(d){return(y(d.value.q3))})
        .attr("height", function(d){return(y(d.value.q1)-y(d.value.q3))})
        .attr("width", boxWidth )
        .attr("stroke", "black")
        .style("fill", "#69b3a2")

  // Show the median
  svg
    .selectAll("medianLines")
    .data(sumstat)
    .enter()
    .append("line")
      .attr("x1", function(d){return(x(d.key)-boxWidth/2) })
      .attr("x2", function(d){return(x(d.key)+boxWidth/2) })
      .attr("y1", function(d){return(y(d.value.median))})
      .attr("y2", function(d){return(y(d.value.median))})
      .attr("stroke", "black")
      .style("width", 80)
})*/

// set the dimensions and margins of the graph
var margin = { top: 10, right: 30, bottom: 30, left: 40 },
    width = 1500 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#boxplot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Read the data and compute summary statistics for each specie
d3.csv("data/story2/boxplot.csv").then(function (data) {

    // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
    var sumstat = d3.group(data, d => d.country);
    sumstat = Array.from(sumstat, ([key, values]) => {
        q1 = d3.quantile(values.map(g => g.value).sort(d3.ascending), 0.25)
        median = d3.quantile(values.map(g => g.value).sort(d3.ascending), 0.5)
        q3 = d3.quantile(values.map(g => g.value).sort(d3.ascending), 0.75)
        interQuantileRange = q3 - q1
        min = q1 - 1.5 * interQuantileRange
        max = q3 + 1.5 * interQuantileRange
        return { key: key, value: { q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max } }
    });

    // Show the X scale
    var x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(d => d.country).filter((value, index, self) => self.indexOf(value) === index))
        .paddingInner(1)
        .paddingOuter(.5)
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))

    // Show the Y scale
    var y = d3.scaleLinear()
        .domain([0, 80])
        .range([height, 0])
    svg.append("g").call(d3.axisLeft(y))

    // Show the main vertical line
    svg
        .selectAll("vertLines")
        .data(sumstat)
        .enter()
        .append("line")
        .attr("x1", function (d) { return (x(d.key)) })
        .attr("x2", function (d) { return (x(d.key)) })
        .attr("y1", function (d) { return (y(d.value.min)) })
        .attr("y2", function (d) { return (y(d.value.max)) })
        .attr("stroke", "black")
        .style("width", 40)

    // rectangle for the main box
    var boxWidth = 25
    svg
        .selectAll("boxes")
        .data(sumstat)
        .enter()
        .append("rect")
        .attr("x", function (d) { return (x(d.key) - boxWidth / 2) })
        .attr("y", function (d) { return (y(d.value.q3)) })
        .attr("height", function (d) { return (y(d.value.q1) - y(d.value.q3)) })
        .attr("width", boxWidth)
        .attr("stroke", "black")
        .style("fill", "#69b3a2")

    // Show the median
    svg
        .selectAll("medianLines")
        .data(sumstat)
        .enter()
        .append("line")
        .attr("x1", function (d) { return (x(d.key) - boxWidth / 2) })
        .attr("x2", function (d) { return (x(d.key) + boxWidth / 2) })
        .attr("y1", function (d) { return (y(d.value.median)) })
        .attr("y2", function (d) { return (y(d.value.median)) })
        .attr("stroke", "black")
        .style("width", 80)
});
