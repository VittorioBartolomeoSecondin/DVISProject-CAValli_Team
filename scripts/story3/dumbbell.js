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
                          Absolute value: ${d[year+'_K']}k NEETs<br>
                          Year: ${year}`)
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
        const margin = {top: 10, right: 30, bottom: 30, left: 120},
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
        
        
          // Add X axis
          const x = d3.scaleLinear()
            .domain([0, 50])
            .range([ 0, width]);
          svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x))
	    .selectAll("text")
	   	.attr("fill", "black");
        
          // Y axis
          const y = d3.scaleBand()
            .range([ 0, height ])
            .domain(data.map(function(d) { return d.Region; }))
            .padding(1);
          svg.append("g")
            .call(d3.axisLeft(y))
	    .selectAll("text")
	    	.attr("fill", "black")
	        .style("text-anchor", "end");

	 // Select lines of X,Y axis
         svg.selectAll(".axis")
	    .selectAll("line")
	    .attr("stroke", "black");
        
          // Lines
          svg.selectAll("myline")
            .data(data)
            .join("line")
              .attr("x1", function(d) { return x(d['2013_perc']); })
              .attr("x2", function(d) { return x(d['2022_perc']); })
              .attr("y1", function(d) { return y(d.Region); })
              .attr("y2", function(d) { return y(d.Region); })
              .attr("stroke", "grey")
              .attr("stroke-width", "1px");
        
          // Circles of variable 1
          svg.selectAll(".mycircle1")
            .data(data)
            .join("circle")
              .attr("cx", function(d) { return x(d['2013_perc']); })
              .attr("cy", function(d) { return y(d.Region); })
              .attr("r", "6")
	      .attr("stroke", "black")
	      .attr("stroke-width", 1)
              .style("fill", "#69b3a2")
              .on("mouseover", function(event, d) {
                  MouseOver(event, d, "2013"); // Pass additional argument "2013"
              })
			  .on("mouseout", MouseOut);
        
          // Circles of variable 2
          svg.selectAll(".mycircle2")
            .data(data)
            .join("circle")
              .attr("cx", function(d) { return x(d['2022_perc']); })
              .attr("cy", function(d) { return y(d.Region); })
              .attr("r", "6")
	      .attr("stroke", "black")
	      .attr("stroke-width", 1)
              .style("fill", "#4C4082")
              .on("mouseover", function(event, d) {
                  MouseOver(event, d, "2022"); // Pass additional argument "2022"
              })
			  .on("mouseout", MouseOut);
        });
    }
}

Dumbbell.initialize();
