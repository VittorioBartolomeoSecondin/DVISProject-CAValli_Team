const width = 200,
    height = 200,
    margin = 20;

const radius = Math.min(width, height) / 2 - margin;

d3.csv("data/story2/donuts/donut2009.csv").then(function(data) {
    // Group the data by 'level'
    const groupedData = d3.group(data, d => d.level);

    for (let i = 1; i <= 7; i += 3) {
        const level = i === 1 ? 'low' : (i === 4 ? 'medium' : 'high');
        const levelData = groupedData.get(level);

        for (let j = i; j <= i + 2; j++) {
            const rank = j - i + 1;
            const countryData = levelData.find(d => +d.rank === rank);

            if (countryData) {
                const svg = d3.select("#donut_" + j)
                  .append("svg")
                    .attr("width", width)
                    .attr("height", height)
                  .append("g")
                    .attr("transform", `translate(${width/2-20},${height/2+20})`);

                // Create the tooltip element
                let tooltip = null;

                const data = { M: +countryData.valueM, F: +countryData.valueF };

                // Setting the title with country name
                d3.select("#title_" + j)
                  .text(countryData.name);

                const color = d3.scaleOrdinal()
                    .domain(["M", "F"])
                    .range([d3.schemeSet1[1], d3.schemeSet1[0]]);

                const pie = d3.pie()
                    .sort(null)
                    .value(d => d[1]);
                const data_ready = pie(Object.entries(data));

                const arc = d3.arc()
                    .innerRadius(radius * 0.5)
                    .outerRadius(radius * 0.8);

                svg.selectAll('allSlices')
                    .data(data_ready)
                    .join('path')
                    .attr('d', arc)
                    .attr('fill', d => color(d.data[1]))
                    .attr("stroke", "black")
                    .attr("stroke-width", 1)
                .on("mouseover", function(event, d) {
		console.log(d);
		// Change stroke width when hovering
                d3.select(this).attr("stroke-width", 2);
			
		if (!tooltip) {
			tooltip = d3.select("body").append("div")
				.attr("id", "donut_tooltip")
				.attr("class", "tooltip")
				.style("opacity", 0);
		}
	              
	        // Show the tooltip
	        tooltip.transition()
	                .duration(200)
	                .style("opacity", 1)
            
           	// Customize the tooltip content
           	tooltip.html("prova")
			.style("left", (event.pageX + 10) + "px")
                  	.style("top", (event.pageY - 20) + "px");
		   
           })
                .on("mouseout", function(event, d) {

		// Returning to original stroke width when not hovering
                d3.select(this).attr("stroke-width", 1);
           
           	if (tooltip) {
		tooltip.transition()
			.duration(200)
			.style("opacity", 0)
			.remove();
		tooltip = null; // Reset tooltip variable
    		}
           });
            }
        }
    }
});
