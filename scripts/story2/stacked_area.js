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

// Read the data
d3.csv("data/story2/disability_neet.csv").then(function (data) {

    // Stack the data
    const stackedData = d3.stack()
        .keys(data.columns.slice(1))
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone)
        .value((d, key) => +d[key])
        (data);

    // Add Y axis
    const y = d3.scaleBand()
        .domain(data.map(d => d.type))
        .range([height, 0])
        .padding(0.2);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add X axis
    const x = d3.scaleLinear()
        .domain([0, d3.max(stackedData[stackedData.length - 1], d => d[1])])
        .range([0, width]);
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    // Color palette
    const color = d3.scaleOrdinal()
        .domain(data.columns.slice(1))
        .range(d3.schemeCategory10);

    // Show the areas
    svg.selectAll("mylayers")
        .data(stackedData)
        .join("path")
        .style("fill", d => color(d.key))
        .attr("d", d3.area()
            .y(d => y(d.data.type))
            .x0(d => x(d[0]))
            .x1(d => x(d[1]))
        );
});
