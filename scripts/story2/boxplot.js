const BoxPlot = {
    initialize: function() {
        // set the dimensions and margins of the graph
        var margin = { top: 10, right: 30, bottom: 30, left: 80 },
            width = 800 - margin.left - margin.right,
            height = 1000 - margin.top - margin.bottom;

        var tooltip = null;
        
        // append the svg object to the body of the page
        var svg = d3.select("#boxplot")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
        
        // Read the data and compute summary statistics for each specie
        d3.csv("data/story2/boxplot.csv").then(function (data) {
           
           var sumstat = d3.group(data, d => d.country);
           sumstat = Array.from(sumstat, ([key, values]) => {
                q1 = d3.quantile(values.map(g => g.value).sort(d3.ascending), 0.25);
                median = d3.quantile(values.map(g => g.value).sort(d3.ascending), 0.5);
                q3 = d3.quantile(values.map(g => g.value).sort(d3.ascending), 0.75);
                interQuantileRange = q3 - q1;
            
                // Find the minimum and maximum values in the dataset
                var datasetMin = d3.min(values, d => d.value);
                var datasetMax = d3.max(values, d => d.value);
            
                // Calculate min and max while considering the dataset boundaries
                min = Math.max(q1 - 1.5 * interQuantileRange, datasetMin);
                max = Math.min(q3 + 1.5 * interQuantileRange, datasetMax);
            
                mean = d3.mean(values, d => d.value); // Calculate mean for each country
            
                return { key: key, value: { q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max, mean: mean } }
            });
        
            // Show the Y scale (inverted X scale)
            var y = d3.scaleBand()
                .range([0, height])
                .domain(data.map(d => d.country).filter((value, index, self) => self.indexOf(value) === index))
                .paddingInner(1)
                .paddingOuter(.5)
            svg.append("g")
                .call(d3.axisLeft(y))
        
            // Show the X scale (inverted Y scale)
            var x = d3.scaleLinear()
                .domain([0, 100])
                .range([0, width])
            svg.append("g").attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x).tickFormat(function (d) { return d + '%'; }));
        
            // Show the main horizontal line (inverted vertical line)
            svg
                .selectAll("horizLines")
                .data(sumstat)
                .enter()
                .append("line")
                .attr("x1", function (d) { return (x(d.value.min)) })
                .attr("x2", function (d) { return (x(d.value.max)) })
                .attr("y1", function (d) { return (y(d.key) + y.bandwidth() / 2) })
                .attr("y2", function (d) { return (y(d.key) + y.bandwidth() / 2) })
                .attr("stroke", "black")
                .style("width", 40)
        
            // rectangle for the main box (inverted)
            var boxHeight = 25
            svg
                .selectAll("boxes")
                .data(sumstat)
                .enter()
                .append("rect")
                .attr("x", function (d) { return (x(d.value.q1)) })
                .attr("y", function (d) { return (y(d.key) - boxHeight / 2) })
                .attr("width", function (d) { return (x(d.value.q3) - x(d.value.q1)) })
                .attr("height", boxHeight)
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .style("fill", "#69b3a2")
                .on("mouseover", function(event, d) {
    	            d3.select(this).attr("stroke-width", 2);
    		
    	            if (!tooltip) {
    	        	    tooltip = d3.select("body").append("div")
    	        		    .attr("class", "tooltip")
    	        		    .style("opacity", 0);
    	            }
    		
    	            // Show the tooltip
    	            tooltip.transition()
    	                .duration(200)
    	                .style("opacity", 1);
    	            
    	            tooltip.html(`<i>Mean</i>: ${d.value.mean.toFixed(1)}%<br><br>
                                  <b>Minimum</b>: ${d.value.min.toFixed(1)}%<br>
                                  <b>Median</b>: ${d.value.median.toFixed(1)}%<br>
                                  <b>Maximum</b>: ${d.value.max.toFixed(1)}%`)
    	        	   .style("left", (event.pageX + 10) + "px")
    	        	   .style("top", (event.pageY - 20) + "px");
    	          })
    	          .on("mouseout", function(d) {
    	            d3.select(this).attr("stroke-width", 1);
    		
    	            if (tooltip) {
    	          		tooltip.transition()
    	          			.duration(500)
    	          			.style("opacity", 0)
    	          			.remove();
    	          		tooltip = null; // Reset tooltip variable
    	            }
    	          });
        
            // Show the median (inverted)
            svg
                .selectAll("medianLines")
                .data(sumstat)
                .enter()
                .append("line")
                .attr("x1", function (d) { return (x(d.value.median)) })
                .attr("x2", function (d) { return (x(d.value.median)) })
                .attr("y1", function (d) { return (y(d.key) - boxHeight / 2) })
                .attr("y2", function (d) { return (y(d.key) + boxHeight / 2) })
                .attr("stroke", "red")
                .style("width", 80)
        });
    }
}

BoxPlot.initialize();
