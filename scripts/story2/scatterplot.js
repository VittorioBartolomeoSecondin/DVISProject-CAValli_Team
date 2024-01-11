// Set up the SVG dimensions
var margin = { top: 30, right: 70, bottom: 90, left: 100 },
		      width = 750 - margin.left - margin.right,
		      height = 650 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#scatterplot")
    .append("svg")
    .attr("id", "scatterplot_svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Read the data
d3.csv("data/story2/scatterplot/scatterplot2009.csv").then( function(data) {

    // Add X axis
    const x = d3.scaleLinear()
    .domain([0, 100])
    .range([0, width]);
    svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickFormat((d) => (d === 0 ? d : d + "%")))
    .append("text")  // Add X axis label
    .attr("class", "axis-label")
    .attr("x", width / 2)
    .attr("y", margin.bottom - 10)
    .style("text-anchor", "middle")
    .style("fill", "black")
    .text("Young people neither in employment nor in education and training (NEET)");

    // Add Y axis
    const y = d3.scaleLinear()
    .domain([0, 100])
    .range([ height, 0]);
    svg.append("g")
    .call(d3.axisLeft(y).tickFormat((d) => (d === 0 ? d : d + "%")))
    .append("text")  // Add Y axis label
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -margin.left + 20)
    .style("text-anchor", "middle")
    .style("fill", "black")
    .text("Persons at risk of poverty or social exclusion");

    // Add dots
    svg.append('g')
    .selectAll("dot")
    .data(data)
    .join("circle")
        .attr("cx", function (d) { return x(d.neet); } )
        .attr("cy", function (d) { return y(d.poverty); } )
        .attr("r", 1.5)
        .style("fill", "#69b3a2")

})
