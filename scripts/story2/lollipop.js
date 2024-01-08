function updateLollipopChart(selectedValue) {
	
	// Set up the SVG dimensions
	var margin = { top: 30, right: 70, bottom: 90, left: 100 },
		      width = 750 - margin.left - margin.right,
		      height = 625 - margin.top - margin.bottom;
	
	// append the svg object to the body of the page
	const svg = d3.select("#lollipop")
	  .append("svg")
	    .attr("id", "lollipop_svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", `translate(${margin.left},${margin.top})`);
	
	// Parse the Data
	d3.csv(selectedValue).then( function(data) {

	  // Treat the first row separately
    	  const firstRow = data.shift(); // Remove and save the first row
	  
	  // Y axis
	  const y = d3.scaleBand()
	    .range([0,  height])
	    .domain(data.map(function(d) { return d.name; }))
	    .padding(1);
	  svg.append("g")
	    .attr("transform", `translate(0, ${height})`)
	    .call(d3.axisBottom(y))
	    .selectAll("text")
	      .style("text-anchor", "end");
	  
	  // Add X axis
	  const x = d3.scaleLinear()
	    .domain([0, 55])
	    .range([0, width]);
	  svg.append("g")
	    .call(d3.axisLeft(x).tickFormat((d) => (d === 0 ? d : d + "%")));

	  // Vertical line
	  svg.append("line")
	    .attr("x1", x(firstRow.abundance)) // Change the x1 to an x-coordinate value
	    .attr("x2", x(firstRow.abundance)) // Change the x2 to the same x-coordinate value
	    .attr("y1", 0) // Start from the top of the chart
	    .attr("y2", height) // Extend to the bottom of the chart
	    .attr("stroke", "red")
	    .attr("stroke-dasharray", "5,5");

	  // Text label vertical line
	  svg.append("text")
	   .attr("x", x(firstRow.abundance)) // Adjust the x-coordinate for positioning
	   .attr("y", height + 5)
	   .attr("dx", "0.35em")
	   .style("font-size", "12px")
	   .text("Europe")
	   .attr("fill", "red");
		
	  // Text label vertical line
	  svg.append("text")
	   .attr("x", x(firstRow.abundance) - 12)
	   .attr("y", height - 40)
	   .attr("dx", "0.35em")
	   .style("font-size", "12px")
	   .text(firstRow.abundance + "%")
	   .attr("fill", "red");
		
	  // Lines
	  svg.selectAll("myline")
	    .data(data)
	    .enter()
	    .append("line")
	      .attr("x1", function(d) { return x(d.abundance); })
	      .attr("x2", x(0))
	      .attr("y1", function(d) { return x(d.name); })
	      .attr("y2", function(d) { return x(d.name); })
	      .attr("stroke", "grey")
	  
	  // Circles
	  svg.selectAll("mycircle")
	    .data(data)
	    .join("circle")
	      .attr("cx", function(d) { return x(d.abundance); })
	      .attr("cy", function(d) { return y(d.name); })
	      .attr("r", "8")
	      .style("fill", "#69b3a2")
	      .attr("stroke", "black")
	      .attr("stroke-width", 1)
	      .on("mouseover", LollipopChartMouseOver)
	      .on("mouseout", LollipopChartMouseOut);
	})
}

function LollipopChartMouseOver(event, d) {
    d3.select(this).attr("stroke-width", 2);
	
    if (!tooltip) {
	    tooltip = d3.select("body").append("div")
		    .attr("id", "lollipop_tooltip")
		    .attr("class", "tooltip")
		    .style("opacity", 0);
    }
	
    // Show the tooltip
    tooltip.transition()
        .duration(200)
        .style("opacity", 1);

    // Tooltip content
    const exactAbundance = d.abundance;
    const countryName = d.name;
	
    tooltip.html(`Country: <b>${countryName}</b> <br>
		    Percentage: ${exactAbundance}%`)
	   .style("left", (event.pageX + 10) + "px")
	   .style("top", (event.pageY - 20) + "px");
}

function LollipopChartMouseOut() {
    d3.select(this).attr("stroke-width", 1);
	
    if (tooltip) {
		tooltip.transition()
			.duration(500)
			.style("opacity", 0)
			.remove();
		tooltip = null; // Reset tooltip variable
    }
}

updateLollipopChart("data/story2/lollipops/lollipop2009_EU.csv");

// Attach an event listener to the year dropdown
document.getElementById("year-dropdown-lollipop").addEventListener("change", function () {

    const selectedValue = "data/story2/lollipops/lollipop" + this.value + "_EU.csv";

    d3.select("#lollipop_svg").remove();
    d3.select("lollipop_tooltip").remove();
    
    updateLollipopChart(selectedValue);
});
