// set the dimensions and margins of the graph
const width = 150,
    height = 150,
    margin = 40;

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
const radius = Math.min(width, height) / 2 - margin

for (let i = 1; i <= 9; i++) { 
    // append the svg object to the div called 'my_dataviz'
    const svg = d3.select("#donut_" + i)
      .append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", `translate(${width/2},${height/2})`);
    
    // Create dummy data
    const data = {a: 9, b: 20, c:30, d:8, e:12, f:3, g:7, h:14}
    
    // set the color scale
    const color = d3.scaleOrdinal()
      .domain(["a", "b", "c", "d", "e", "f", "g", "h"])
      .range(d3.schemeDark2);
    
    // Compute the position of each group on the pie:
    const pie = d3.pie()
      .sort(null) // Do not sort group by size
      .value(d => d[1])
    const data_ready = pie(Object.entries(data))
    
    // The arc generator
    const arc = d3.arc()
      .innerRadius(radius * 0.5)         // This is the size of the donut hole
      .outerRadius(radius * 0.8)
    
    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
      .selectAll('allSlices')
      .data(data_ready)
      .join('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data[1]))
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 0.7)
}
