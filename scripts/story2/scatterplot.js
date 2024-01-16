function updateScatterplotChart(selectedValue) {

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
   const svg = d3.select("#scatterplot")
      .append("svg")
      .attr("id", "scatterplot_svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

   // Read the data
   d3.csv(selectedValue).then(function (data) {

      // Filter out data points where either "neet" or "poverty" is empty
      data = data.filter(d => d.neet !== "" && d.poverty !== "");

      // Dynamically set the domain of x and y axes
      const x_domain = Math.max(50, (d3.max(data, d => +d.neet)));
      const y_domain = Math.max(50, (d3.max(data, d => +d.poverty)));

      // Add X axis
      const x = d3.scaleLinear()
         .domain([0, x_domain])
         .range([0, width]);
      svg.append("g")
         .attr("class", "axis")
         .attr("transform", `translate(0, ${height})`)
         .call(d3.axisBottom(x).tickFormat((d) => (d === 0 ? d : d + "%")))
         .selectAll("text")
         .attr("fill", "black");

      // Add X axis label
      svg.append("text")
		  .attr("class", "axis-label")
		  .attr("x", width - 20)
		  .attr("y", height + margin.bottom - 60) // Adjusted the y-coordinate
		  .style("text-anchor", "middle")
		  .style("fill", "black")
	          .style("font-size", 10)
		  .text("NEETs");

      // Add Y axis
      const y = d3.scaleLinear()
         .domain([0, y_domain])
         .range([height, 0]);
      svg.append("g")
         .attr("class", "axis")
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
      .text("Persons at risk of poverty or social exclusion");*/

      // Select lines of X,Y axes
      svg.selectAll(".axis")
         .selectAll("line")
         .attr("stroke", "black");

      // Add dots
      svg.append('g')
         .selectAll("dot")
         .data(data)
         .join("circle")
         .attr("cx", function (d) {
            return x(d.neet);
         })
         .attr("cy", function (d) {
            return y(d.poverty);
         })
         .attr("r", 2.5)
	 .attr("stroke", "black")
         .attr("stroke-width", 1)
         .style("fill", "#69b3a2")
         .on("mouseover", function (event, d) {
            d3.select(this).attr("r", 5);

	    // Draw dotted lines
            svg.append("line")
               .attr("class", "x-line")
               .attr("x1", x(d.neet))
               .attr("y1", y(d.poverty))
               .attr("x2", x(d.neet))
               .attr("y2", height)
               .attr("stroke", "black")
               .attr("stroke-width", 1)
               .attr("stroke-dasharray", "4")
	       .style("opacity", 0.5);

            svg.append("line")
               .attr("class", "y-line")
               .attr("x1", 0)
               .attr("y1", y(d.poverty))
               .attr("x2", x(d.neet))
               .attr("y2", y(d.poverty))
               .attr("stroke", "black")
               .attr("stroke-width", 1)
               .attr("stroke-dasharray", "4")
	       .style("opacity", 0.5);
               
            if (!tooltip) {
               tooltip = d3.select("body").append("div")
                  .attr("id", "scatterplot_tooltip")
                  .attr("class", "tooltip")
                  .style("opacity", 0);
            }

            // Show the tooltip
            tooltip.transition()
               .duration(200)
               .style("opacity", 1)

            // Set the customized tooltip content
            tooltip.html(`<b>${d.Country} (${d.Abbreviation})</b> <br>
    			       NEETs: ${d.neet}% <br>
			       Persons at risk of poverty: ${d.poverty}%`)
               .style("left", (event.pageX + 10) + "px")
               .style("top", (event.pageY - 20) + "px");
         })
         .on("mousemove", function (event, d) {
	    // Move the tooltip with the mouse pointer
	    tooltip.style("left", (event.pageX + 10) + "px")
	       .style("top", (event.pageY + 10) + "px");
         })
         .on("mouseout", function (event, d) {
            d3.select(this).attr("r", 2.5);
                   
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

updateScatterplotChart("data/story2/scatterplot/scatterplot2009.csv");

// Attach an event listener to the year dropdown
document.getElementById("year-dropdown-scatterplot").addEventListener("change", function () {

   const selectedValue = "data/story2/scatterplot/scatterplot" + this.value + ".csv";

   d3.select("#scatterplot_svg").remove();
   d3.select("#scatterplot_tooltip").remove();

   updateScatterplotChart(selectedValue);
});
