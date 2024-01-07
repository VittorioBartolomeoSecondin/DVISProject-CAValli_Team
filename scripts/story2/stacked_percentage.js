function animateStackedBars(svg) {
    svg.selectAll("rect")
        .transition()
        .duration(1000) // Set the duration of the animation in milliseconds
        .attr("height", d => y.bandwidth() - y(0))
        .attr("y", d => y(d.data.Country) + y(0))
        .delay((d, i) => i * 50) // Add a delay between each bar for a smoother effect
        .ease(d3.easeLinear); // Set the easing function for the animation
}

function createStackedPLegend() {
    var legendContainer = d3.select("#stacked_percentage_1_legend");

    // Data for legend items
    var legendData = [
        { level: 'Low', color: '#b51d14' },
        { level: 'Medium', color: '#ddb310' },
        { level: 'High', color: '#4053d3' }
    ];

    // Create legend items
    var legendItems = legendContainer.selectAll(".legend-item")
        .data(legendData)
        .enter()
        .append("div")
        .attr("class", "legend-item");

    // Add color boxes to legend
    legendItems.append("div")
        .attr("class", "legend-color-box")
        .style("background-color", function (d) { return d.color; });

    // Add country names to legend
    legendItems.append("div")
        .attr("class", "legend-text")
        .text(function (d) { return d.level; });
}

function updateStackedPChart(selectedValue) {

  // Parse the Data
  d3.csv(selectedValue).then( function(data) {

      // Set up the SVG dimensions
      var margin = { top: 30, right: 70, bottom: 70, left: 100 },
	      width = 900 - margin.left - margin.right,
	      height = 625 - margin.top - margin.bottom;
    
      // append the svg object to the body of the page
      const svg = d3.select("#stacked_percentage_1")
                    .append("svg")
                      .attr("id", "stacked_percentage_svg")
                      .attr("width", width + margin.left + margin.right)
                      .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                      .attr("transform", `translate(${margin.left},${margin.top})`);

      
      // Create the tooltip element
      let tooltip = null;
      
      // List of subgroups = header of the csv files = "low", "medium", "high"
      const subgroups = data.columns.slice(2);
    
      // List of groups = value of the first column = countries -> on Y axis
      const groups = data.map(d => d.Country);

      var filteredData = data;
    
      // Define maximum
      var max = d3.max(filteredData, d => d3.sum(subgroups.map(key => +d[key])));  
    
      // Add X axis
      const x = d3.scaleLinear()
                  .domain([0, 100])
                  .range([0, width]);
      
      svg.append("g")
           .attr("class", "axis")
           .attr("transform", `translate(0, ${height})`)
         .call(d3.axisBottom(x))
         .selectAll("text")
           .attr("transform", "translate(-10,0)rotate(-45)")
         .style("text-anchor", "end");
      
      // Add Y axis
      const y = d3.scaleBand()
                  .range([0, height])
                  .domain(groups)
                  .padding(0.5);
      
      svg.append("g")
         .attr("class", "axis")
         .call(d3.axisLeft(y).tickSizeOuter(0));
    
      // Color palette = one color per subgroup
      const color = d3.scaleOrdinal()
	              .range(['#b51d14', '#ddb310', '#4053d3'])
	              .domain(subgroups);
  
      // Normalize the data -> sum of each group must be 100!
      dataNormalized = []
      filteredData.forEach(function(d){
          
          // Compute the total
          tot = 0
          for (i in subgroups){ name=subgroups[i] ; tot += +d[name] }
          
          // Now normalize
	  for (i in subgroups) {
	        name = subgroups[i];
	        const originalValue = +d[name]; // Store the original value
	        d[name] = (originalValue / tot * 100).toFixed(2); // Normalize to 100
	        d[`${name}_original`] = originalValue; // Create a new property for the original value
	   }
        
      })
  
      // Stack the data (per subgroup)
      const stackedData = d3.stack()
                            .keys(subgroups)                      
                            .value((d, key) => +d[key])
                            .order(d3.stackOrderNone)
                            .offset(d3.stackOffsetNone)
                            (filteredData);
    
      // Show the bars
      svg.append("g")
         .selectAll("g")
         // Enter in the stack data = loop key per key = group per group
         .data(stackedData)
         .join("g")
           .attr("fill", d => color(d.key))
           .selectAll("rect")
           // enter a second time = loop subgroup per subgroup to add all rectangles
           .data(d => d)
           .join("rect")
             .attr("x", d => x(d[0]))
             .attr("y", d => y(d.data.Country))
             .attr("width", d => x(d[1]) - x(d[0]))
             .attr("height", y.bandwidth())
	     .attr("stroke", "black") 
             .attr("stroke-width", 1)
	     .style("opacity", 0.7)
           .on("mouseover", function(event, d) {

		// Change stroke width when hovering
                d3.select(this).attr("stroke-width", 2).style("opacity", 1);
		   
		if (!tooltip) {
			tooltip = d3.select("body").append("div")
				.attr("id", "stacked_percentage_tooltip")
				.attr("class", "tooltip")
				.style("opacity", 0);
		}
    
	        // Show the tooltip
	        tooltip.transition()
	                .duration(200)
	                .style("opacity", 1)
            
           	// Define the subgroup name and value to display them in the tooltip
           	const subgroupName = d3.select(this.parentNode).datum().key;
           	const subgroupValue = d.data[subgroupName];
	   	const subgroupOriginalValue = d.data[`${subgroupName}_original`]; 
            
           	// Customize the tooltip content
           	tooltip.html(`Education level: <span style="color:${color(subgroupName)}"><b>${subgroupName.charAt(0).toUpperCase() + subgroupName.slice(1)}</b></span><br>Percentage: ${subgroupValue}%<br>Absolute value: ${subgroupOriginalValue} k persons`)
			.style("left", (event.pageX + 10) + "px")
                  	.style("top", (event.pageY - 20) + "px");
		   
           })
           .on("mouseout", function(event, d) {
    
           	// Returning to original stroke width when not hovering
                d3.select(this).attr("stroke-width", 1).style("opacity", 0.7);
           
           	if (tooltip) {
		tooltip.transition()
			.duration(200)
			.style("opacity", 0)
			.remove();
		tooltip = null; // Reset tooltip variable
    		}
           })
	   .call(animateStackedBars);
	  createStackedPLegend();
  })
	
}

updateStackedPChart("data/story2/stacked/stacked2009.csv");

// Attach an event listener to the year dropdown
document.getElementById("year-dropdown").addEventListener("change", function () {

    const useVariantDataset = document.getElementById("variant-checkbox").checked;

    let selectedValue;
    if (useVariantDataset) {
        selectedValue = "data/story2/stacked/stacked" + this.value + "_low.csv";
    } else {
        selectedValue = "data/story2/stacked/stacked" + this.value + ".csv";
    }
	
    d3.select("#stacked_percentage_svg").remove();
    d3.select("#stacked_percentage_tooltip").remove();
    // Remove elements with IDs from donut_1 to donut_9
    for (let i = 1; i <= 9; i++) 
	d3.select("#donut_" + i + "_svg").remove();

    updateStackedPChart(selectedValue);
    updateDonuts("data/story2/donuts/donut" + this.value + ".csv");
});

// Add an event listener to the checkbox
document.getElementById("variant-checkbox").addEventListener("change", function () {
    // Trigger a change in the year dropdown to reload the chart with the current dataset
    document.getElementById("year-dropdown").dispatchEvent(new Event("change"));
});
