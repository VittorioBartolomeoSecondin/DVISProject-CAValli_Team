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

                svg.selectAll('allSlices')
                    .data(data_ready)
                    .join('path')
                    .attr('d', arc)
                    .attr('fill', d => color(d.data[0]))
                    .attr("stroke", "black")
                    .attr("stroke-width", 1);

		// Add the polylines between chart and labels:
		svg
		  .selectAll('allPolylines')
		  .data(data_ready)
		  .join('polyline')
		    .attr("stroke", "black")
		    .style("fill", "none")
		    .attr("stroke-width", 1)
		    .attr('points', function(d) {
		      const posA = arc.centroid(d) // line insertion in the slice
		      const posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
		      const posC = outerArc.centroid(d); // Label position = almost the same as posB
		      const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
		      posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
		      return [posA, posB, posC]
		    })
		
		// Add the polylines between chart and labels:
		svg
		  .selectAll('allLabels')
		  .data(data_ready)
		  .join('text')
		    .text(d => d.data[0])
		    .attr('transform', function(d) {
		        const pos = outerArc.centroid(d);
		        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
		        pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
		        return `translate(${pos})`;
		    })
		    .style('text-anchor', function(d) {
		        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
		        return (midangle < Math.PI ? 'start' : 'end')
		    })
                
            }
        }
    }
});
