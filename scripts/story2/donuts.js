const width = 275,
    height = 275,
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
                    .attr("transform", `translate(${width/2},${height/2+20})`);

                // Calculate the total sum of male and female values for each country
                countryData.total = +countryData.valueM + +countryData.valueF;

                // Convert counts to percentages
                countryData.percentM = (+countryData.valueM / countryData.total) * 100;
                countryData.percentF = (+countryData.valueF / countryData.total) * 100;

                const data = { Male: countryData.percentM, Female: countryData.percentF };

                // Setting the title with country name
                d3.select("#title_" + j)
                  .text(countryData.name);

                const color = d3.scaleOrdinal()
                    .domain(["Male", "Female"])
                    .range([d3.schemeSet1[1], d3.schemeSet1[0]]);

                const pie = d3.pie()
			    .sort(null)
			    .value(d => d[1]);
		const data_ready = pie(Object.entries(data));

                const arc = d3.arc()
                    .innerRadius(radius * 0.5)
                    .outerRadius(radius * 0.8);

		// Another arc that won't be drawn. Just for labels positioning
		const outerArc = d3.arc()
		  .innerRadius(radius * 0.9)
		  .outerRadius(radius * 0.9);

		/*svg.selectAll('allSlices')
		    .data(data_ready)
		    .join('path')
		    .attr('d', arc)
		    .attr('fill', d => color(d.data[0]))
		    .attr("stroke", "black")
		    .attr("stroke-width", 1)
		    .each(function(d) {
		        const centroid = arc.centroid(d);
		        svg.append('text')
		            .attr('text-anchor', 'middle')
		            .attr('fill', 'white')
		            .attr('x', centroid[0])
		            .attr('y', centroid[1])
		            .attr('font-size', '10px') // Adjust the font size here
		            .text(`${d.data[1].toFixed(1)}%`);
		    });*/

		svg.selectAll('allSlices')
		    .data(data_ready)
		    .join('path')
		    .attr('d', arc)
		    .attr('fill', 'white') // Initially set fill to white
		    .attr("stroke", "black")
		    .attr("stroke-width", 1)
		    .transition() // Apply transition
		    .duration(1000) // Set the duration of the transition in milliseconds
		    .attr('fill', d => color(d.data[0])); // Transition to the respective color

		// Add text after the transition
		svg.selectAll('allSlices')
		    .each(function(d) {
			const centroid = arc.centroid(d);
			svg.append('text')
			    .attr('text-anchor', 'middle')
			    .attr('fill', 'white')
			    .attr('x', centroid[0])
			    .attr('y', centroid[1])
			    .attr('font-size', '10px') // Adjust the font size here
			    .text(`${d.data[1].toFixed(1)}%`)
			    .style('opacity', 0) // Initially set text opacity to 0
			    .transition() // Apply text transition
			    .delay(800) // Delay text appearance after the fill animation
			    .duration(200) // Set text appearance duration
			    .style('opacity', 1); // Transition to visible state
		    });
            }
        }
    }
});
