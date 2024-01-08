function updateLollipopChart(selectedValue) {
	
	/*// Set up the SVG dimensions
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
	  
	  // X axis
	  const x = d3.scaleBand()
	    .range([ 0, width ])
	    .domain(data.map(function(d) { return d.name; }))
	    .padding(1);
	  svg.append("g")
	    .attr("transform", `translate(0, ${height})`)
	    .call(d3.axisBottom(x))
	    .selectAll("text")
	      .attr("transform", "translate(-10,0)rotate(-45)")
	      .style("text-anchor", "end");
	  
	  // Add Y axis
	  const y = d3.scaleLinear()
	    .domain([0, 55])
	    .range([height, 0]);
	  svg.append("g")
	    .call(d3.axisLeft(y).tickFormat((d) => (d === 0 ? d : d + "%")));

	  // Horizontal line
	  svg.append("line")
	    .attr("x1", 0)
  	    .attr("x2", width)
	    .attr("y1", y(firstRow.abundance))
	    .attr("y2", y(firstRow.abundance))
	    .attr("stroke", "red")
	    .attr("stroke-dasharray", "5,5");

	  // Text label horizontal line
	  svg.append("text")
	   .attr("x", width + 5) // Adjust the x-coordinate for positioning
	   .attr("y", y(firstRow.abundance))
	   .attr("dy", "0.35em")
	   .style("font-size", "12px")
	   .text("Europe")
	   .attr("fill", "red");
		
	  // Text label horizontal line
	  svg.append("text")
	   .attr("x", width - 40)
	   .attr("y", y(firstRow.abundance) - 12)
	   .attr("dy", "0.35em")
	   .style("font-size", "12px")
	   .text(firstRow.abundance + "%")
	   .attr("fill", "red");
		
	  // Lines
	  svg.selectAll("myline")
	    .data(data)
	    .enter()
	    .append("line")
	      .attr("x1", function(d) { return x(d.name); })
	      .attr("x2", function(d) { return x(d.name); })
	      .attr("y1", function(d) { return y(d.abundance); })
	      .attr("y2", y(0))
	      .attr("stroke", "grey")
	  
	  // Circles
	  svg.selectAll("mycircle")
	    .data(data)
	    .join("circle")
	      .attr("cx", function(d) { return x(d.name); })
	      .attr("cy", function(d) { return y(d.abundance); })
	      .attr("r", "8")
	      .style("fill", "#69b3a2")
	      .attr("stroke", "black")
	      .attr("stroke-width", 1)
	      .on("mouseover", LollipopChartMouseOver)
	      .on("mouseout", LollipopChartMouseOut);
	})
}*/

// Horizontal line (now vertical)
  svg.append("line")
    .attr("x1", y(firstRow.abundance)) // x1 and x2 are swapped
    .attr("x2", y(firstRow.abundance)) // x1 and x2 are swapped
    .attr("y1", 0) // y1 and y2 are swapped
    .attr("y2", height) // y1 and y2 are swapped
    .attr("stroke", "red")
    .attr("stroke-dasharray", "5,5")
    .attr("transform", "translate(" + margin.left + ",0)"); // Adjust for horizontal orientation
  
  // Text label horizontal line (now vertical)
  svg.append("text")
    .attr("x", y(firstRow.abundance) + 5) // Adjust the x-coordinate for positioning
    .attr("y", height + margin.top + 5) // Adjust for horizontal orientation
    .attr("dy", "0.35em")
    .style("font-size", "12px")
    .text("Europe")
    .attr("fill", "red")
    .attr("transform", "translate(" + margin.left + ",0)"); // Adjust for horizontal orientation
  
  // Text label horizontal line (now vertical)
  svg.append("text")
    .attr("x", y(firstRow.abundance) + 12) // Adjust the x-coordinate for positioning
    .attr("y", height - 40) // Adjust for horizontal orientation
    .attr("dy", "0.35em")
    .style("font-size", "12px")
    .text(firstRow.abundance + "%")
    .attr("fill", "red")
    .attr("transform", "translate(" + margin.left + ",0)"); // Adjust for horizontal orientation
  
  // Lines (now horizontal)
  svg.selectAll("myline")
    .data(data)
    .enter()
    .append("line")
      .attr("x1", 0) // x1 and x2 are swapped
      .attr("x2", function(d) { return y(d.abundance); }) // x1 and x2 are swapped
      .attr("y1", function(d) { return x(d.name); }) // y1 and y2 are swapped
      .attr("y2", function(d) { return x(d.name); }) // y1 and y2 are swapped
      .attr("stroke", "grey")
      .attr("transform", "translate(" + margin.left + ",0)"); // Adjust for horizontal orientation
  
  // Circles (now horizontal)
  svg.selectAll("mycircle")
    .data(data)
    .join("circle")
      .attr("cx", function(d) { return y(d.abundance); }) // cx and cy are swapped
      .attr("cy", function(d) { return x(d.name); }) // cx and cy are swapped
      .attr("r", "8")
      .style("fill", "#69b3a2")
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .on("mouseover", LollipopChartMouseOver)
      .on("mouseout", LollipopChartMouseOut)
      .attr("transform", "translate(" + margin.left + ",0)"); // Adjust for horizontal orientation
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
