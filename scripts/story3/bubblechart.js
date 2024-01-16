function BubbleChart() {
   // Set up the SVG dimensions
   var margin = {
         top: 30,
         right: 70,
         bottom: 90,
         left: 50
      },
      width = 750 - margin.left - margin.right,
      height = 650 - margin.top - margin.bottom;

   // Append the svg object to the div of the chart
   const svg = d3.select("#bubblechart")
      .append("svg")
      .attr("id", "bubblechart_svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

   // Read the data
   d3.csv("data/story3/bubblechart.csv").then(function (data) {

      // Add X axis
      const x = d3.scaleLinear()
         .domain([0, 30])
         .range([0, width]);
      svg.append("g")
         .attr("transform", `translate(0, ${height})`)
         .call(d3.axisBottom(x).tickFormat((d) => (d === 0 ? d : d + "%")))
         .selectAll("text")
         .attr("fill", "black");

      // Add X axis label
      svg.append("text")
        .attr("class", "axis-label")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 40) // Adjusted the y-coordinate
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text("Early leavers");

      // Add Y axis
      const y = d3.scaleLinear()
         .domain([0, 30])
         .range([height, 0]);
      svg.append("g")
         .call(d3.axisLeft(y).tickFormat((d) => (d === 0 ? d : d + "%")))
         .selectAll("text")
         .attr("fill", "black");
      /*.append("text")  // Add Y axis label
      .attr("class", "axis-label")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 20)
      .style("text-anchor", "middle")
      .style("fill", "black")
      .text("Incidence of individual relative poverty (% of people living in families in relative poverty among residents)");*/

      // Select lines of X,Y axes
      svg.selectAll(".axis")
         .selectAll("line")
         .attr("stroke", "black");

      // Add a scale for bubble size
      const z = d3.scaleLinear()
         .domain([0, 30])
         .range([0, 20]);

      // Add dots
      svg.append('g')
         .selectAll("dot")
         .data(data)
         .join("circle")
         .attr("cx", d => x(d.leavers))
         .attr("cy", d => y(d.poverty))
         .attr("r", d => z(d.neet))
         .style("fill", "#69b3a2")
         .style("opacity", "0.7")
         .attr("stroke", "black")
         .attr("stroke-width", 1)
         .on("mouseover", function (event, d) {
            d3.select(this).attr("stroke-width", 2).style("opacity", 1);
             
	    // Draw dotted lines
            svg.append("line")
               .attr("class", "x-line")
               .attr("x1", x(d.leavers))
               .attr("y1", y(d.poverty))
               .attr("x2", x(d.leavers))
               .attr("y2", height)
               .attr("stroke", "black")
               .attr("stroke-width", 1)
               .attr("stroke-dasharray", "4")
	       .style("opacity", 0.5);
                       
            svg.append("line")
               .attr("class", "y-line")
               .attr("x1", 0)
               .attr("y1", y(d.poverty))
               .attr("x2", x(d.leavers))
               .attr("y2", y(d.poverty))
               .attr("stroke", "black")
               .attr("stroke-width", 1)
               .attr("stroke-dasharray", "4")
	       .style("opacity", 0.5);
                     
            if (!tooltip) {
               tooltip = d3.select("body").append("div")
                  .attr("id", "bubblechart_tooltip")
                  .attr("class", "tooltip")
                  .style("opacity", 0);
            }

            // Show the tooltip
            tooltip.transition()
               .duration(200)
               .style("opacity", 1)

            // Set the customized tooltip content
            tooltip.html(`<b>${d.region}</b>:<br>
	 		     ${d.neet}% NEETs`)
               .style("left", (event.pageX + 10) + "px")
               .style("top", (event.pageY - 20) + "px");
         })
	 .on("mousemove", function (event, d) {
	   // Move the tooltip with the mouse pointer
	   tooltip.style("left", (event.pageX + 10) + "px")
	      .style("top", (event.pageY + 10) + "px");
        })
         .on("mouseout", function (event, d) {
            d3.select(this).attr("stroke-width", 1).style("opacity", 0.7);
                         
	    // Remove dotted lines
            svg.selectAll(".x-line").remove();
            svg.selectAll(".y-line").remove();
                           
            if (tooltip) {
               tooltip.transition()
                  .duration(500)
                  .style("opacity", 0)
                  .remove();
               tooltip = null; // Reset tooltip variable
            }
         });
   })
}

BubbleChart();
