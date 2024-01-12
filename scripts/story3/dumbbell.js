const Dumbbell = {
    tooltip: null,

    initialize: function() {
        const self = this;

        function MouseOver(event, d, year) {
            d3.select(event.target).attr("stroke-width", 2);
        	
            if (!self.tooltip) {
        	    self.tooltip = d3.select("body").append("div")
        		    .attr("id", "dumbbell_tooltip")
        		    .attr("class", "tooltip")
        		    .style("opacity", 0);
            }
        	
            // Show the tooltip
            self.tooltip.transition()
                .duration(200)
                .style("opacity", 1);
        	
            self.tooltip.html(`<b>${d.Region}</b>: ${d[year+'_perc']}%<br>
                          Absolute value: ${d[year+'_K']}k NEETs`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        }

        function MouseOut() {
            d3.select(this).attr("stroke-width", 1);
        	
            if (self.tooltip) {
        		self.tooltip.transition()
        			.duration(500)
        			.style("opacity", 0)
        			.remove();
        		self.tooltip = null; // Reset tooltip variable
            }
        }
        
        // set the dimensions and margins of the graph
        const margin = {top: 30, right: 30, bottom: 30, left: 120},
            width = 700 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;
        
        // append the svg object to the body of the page
        const svg = d3.select("#dumbbell")
          .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);
        
        // Parse the Data
        d3.csv("data/story3/dumbbell.csv").then( function(data) {
          // Treat the first row separately
    	  const firstRow = data.shift(); // Remove and save the first row
        
          // Add X axis
          const x = d3.scaleLinear()
            .domain([0, 50])
            .range([ 0, width]);
          svg.append("g")
	    .attr("class", "axis")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x).tickFormat((d) => (d === 0 ? d : d + "%")))
	    .selectAll("text")
	   	.attr("fill", "black");
        
          // Y axis
          const y = d3.scaleBand()
            .range([ 0, height ])
            .domain(data.map(function(d) { return d.Region; }))
            .padding(1);
          svg.append("g")
	    .attr("class", "axis")
            .call(d3.axisLeft(y))
	    .selectAll("text")
	    	.attr("fill", "black")
	        .style("text-anchor", "end");

	 // Select lines of X,Y axis
         svg.selectAll(".axis")
	    .selectAll("line")
	    .attr("stroke", "black");

	  // Vertical line
	  svg.append("line")
	    .attr("x1", x(firstRow['2013_perc'])) // Change the x1 to an x-coordinate value
	    .attr("x2", x(firstRow['2013_perc'])) // Change the x2 to the same x-coordinate value
	    .attr("y1", 0) // Start from the top of the chart
	    .attr("y2", height) // Extend to the bottom of the chart
	    .attr("stroke", "#69b3a2")
	    .attr("stroke-dasharray", "5,5");

	  // Text label vertical line
	  svg.append("text")
	   .attr("x", x(firstRow['2013_perc'])) // Adjust the x-coordinate for positioning
	   .attr("y", 0)
	   .attr("dx", "-2.7em")
	   .attr("dy", "-0.5em")
	   .style("font-size", "12px")
	   .html(`Italia<br>2013')
	   .attr("fill", "#69b3a2");

	  // Text label vertical line
	  svg.append("text")
	   .attr("x", x(firstRow['2013_perc']) - 60)
	   .attr("y", height - 40)
	   .attr("dx", "1.5em")
	   .style("font-size", "12px")
	   .text(firstRow['2013_perc'] + "%")
	   .attr("fill", "#69b3a2");

	  // Vertical line
	  svg.append("line")
	    .attr("x1", x(firstRow['2022_perc'])) // Change the x1 to an x-coordinate value
	    .attr("x2", x(firstRow['2022_perc'])) // Change the x2 to the same x-coordinate value
	    .attr("y1", 0) // Start from the top of the chart
	    .attr("y2", height) // Extend to the bottom of the chart
	    .attr("stroke", "#4C4082")
	    .attr("stroke-dasharray", "5,5");

	  // Text label vertical line
	  svg.append("text")
	   .attr("x", x(firstRow['2022_perc'])) // Adjust the x-coordinate for positioning
	   .attr("y", 0)
	   .attr("dx", "-2.7em")
	   .attr("dy", "-0.5em")
	   .style("font-size", "12px")
	   .html(`Italia<br>2022')
	   .attr("fill", "#4C4082");

	  // Text label vertical line
	  svg.append("text")
	   .attr("x", x(firstRow['2022_perc']) - 60)
	   .attr("y", height - 40)
	   .attr("dx", "1.5em")
	   .style("font-size", "12px")
	   .text(firstRow['2022_perc'] + "%")
	   .attr("fill", "#4C4082");
	 
          // Lines
          const lines = svg.selectAll("myline")
		            .data(data)
		            .join("line")
		              .attr("x1", function(d) { return x(d['2013_perc']); })
		              .attr("x2", function(d) { return x(d['2013_perc']); })
		              .attr("y1", function(d) { return y(d.Region); })
		              .attr("y2", function(d) { return y(d.Region); })
		              .attr("stroke", "grey")
		              .attr("stroke-width", "1px");
        
          // Circles of variable 1
          const circles1 = svg.selectAll(".mycircle1")
			    .data(data)
			    .join("circle")
			      .attr("cx", function(d) { return x(d['2013_perc']); })
			      .attr("cy", function(d) { return y(d.Region); })
			      .attr("r", "0")
			      .attr("stroke", "black")
			      .attr("stroke-width", 1)
			      .style("fill", "#69b3a2")
			      .on("mouseover", function(event, d) {
				  MouseOver(event, d, "2013"); // Pass additional argument "2013"
			      })
			      .on("mouseout", MouseOut);
        
          // Circles of variable 2
          const circles2 = svg.selectAll(".mycircle2")
		            .data(data)
		            .join("circle")
		              .attr("cx", function(d) { return x(d['2022_perc']); })
		              .attr("cy", function(d) { return y(d.Region); })
		              .attr("r", "0")
			      .attr("stroke", "black")
			      .attr("stroke-width", 1)
		              .style("fill", "#4C4082")
		              .on("mouseover", function(event, d) {
		                  MouseOver(event, d, "2022"); // Pass additional argument "2022"
		              })
			      .on("mouseout", MouseOut);

	  lines.transition()
	    .duration(1000)
	    .delay((d, i) => i * 100)
	    .attr("x2", function(d) { return x(d['2022_perc']); })
	    .on("end", function() {
	        // Transition for increasing circle radius
	        circles1.transition()
	            .duration(250) // Duration for the circle animation
	            .attr("r", "6"); // Adjust the final radius as needed

		circles2.transition()
	            .duration(250) // Duration for the circle animation
	            .attr("r", "6"); // Adjust the final radius as needed
	    });
        });
    }
}

Dumbbell.initialize();
