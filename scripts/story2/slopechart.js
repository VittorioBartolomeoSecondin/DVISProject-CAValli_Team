// Use d3.csv to load data from a CSV file
  d3.csv("data/story2/slopechart.csv").then(function(dataset) {

    // Set up SVG dimensions
    var margin = { top: 20, right: 20, bottom: 50, left: 50 },
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // Create SVG element
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Define colors
    var colors = d3.schemeSet1;

    // Create scales
    var xScale = d3.scaleLinear().domain([2013, 2020]).range([0, width]);
    var yScale = d3.scaleLinear().domain([20, 30]).range([height, 0]);

    // Create line function
    var line = d3.line()
        .x(function(d) { return xScale(d.year); })
        .y(function(d) { return yScale(d.value); });

    // Draw vertical lines for the years
    svg.append("line")
        .attr("x1", xScale(2013))
        .attr("y1", 0)
        .attr("x2", xScale(2013))
        .attr("y2", height)
        .attr("stroke", "black")
        .style("opacity", 0.7);

    svg.append("line")
        .attr("x1", xScale(2020))
        .attr("y1", 0)
        .attr("x2", xScale(2020))
        .attr("y2", height)
        .attr("stroke", "black")
        .style("opacity", 0.7);

    // Draw lines
    svg.selectAll(".line")
        .data(dataset)
        .enter().append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line([{ year: 2013, value: +d['2013'] }, { year: 2020, value: +d['2020'] }]); })
        .style("stroke", function(d, i) { return (d.sex === "M") ? colors[0] : colors[1]; });

    // Draw points for both starting and final years
    svg.selectAll(".start-point")
        .data(dataset)
        .enter().append("circle")
        .attr("class", "start-point")
        .attr("cx", function(d) { return xScale(2013); })
        .attr("cy", function(d) { return yScale(+d['2013']); })
        .attr("r", 6)
        .style("fill", function(d, i) { return (d.sex === "M") ? colors[0] : colors[1]; })
        .on("mouseover", function(d) {
          // Display tooltip
          tooltip.transition()
            .duration(200)
            .style("opacity", .9);
          tooltip.html(d.sex + " (2013): " + d['2013'])
            .style("left", (d3.event.pageX + 5) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
          // Hide tooltip
          tooltip.transition()
            .duration(500)
            .style("opacity", 0);
        });

    svg.selectAll(".final-point")
        .data(dataset)
        .enter().append("circle")
        .attr("class", "final-point")
        .attr("cx", function(d) { return xScale(2020); })
        .attr("cy", function(d) { return yScale(+d['2020']); })
        .attr("r", 6)
        .style("fill", function(d, i) { return (d.sex === "M") ? colors[0] : colors[1]; })
        .on("mouseover", function(d) {
          // Display tooltip
          tooltip.transition()
            .duration(200)
            .style("opacity", .9);
          tooltip.html(d.sex + " (2020): " + d['2020'])
            .style("left", (d3.event.pageX + 5) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
          // Hide tooltip
          tooltip.transition()
            .duration(500)
            .style("opacity", 0);
        });

    // Draw labels for starting points
    svg.selectAll(".start-label")
        .data(dataset)
        .enter().append("text")
        .attr("class", "start-label")
        .attr("x", xScale(2013) - 5)
        .attr("y", function(d) { return yScale(+d['2013']); })
        .text(function(d) { return d.sex; })
        .style("fill", function(d, i) { return (d.sex === "M") ? colors[0] : colors[1]; });

    // Draw labels for years
    svg.append("text")
        .attr("x", xScale(2013))
        .attr("y", height + 40)
        .text("2013")
        .attr("text-anchor", "middle");

    svg.append("text")
        .attr("x", xScale(2020))
        .attr("y", height + 40)
        .text("2020")
        .attr("text-anchor", "middle");

    // Create tooltip
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

  }).catch(function(error) {
    console.log(error);
  });
