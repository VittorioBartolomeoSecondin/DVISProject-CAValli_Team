function updateDonuts(selectedValue) {
   const width = 240,
      height = 240,
      margin = 20;

   const radius = Math.min(width, height) / 2 - margin;

   d3.csv(selectedValue).then(function (data) {
      // Group the data by 'level'
      const groupedData = d3.group(data, d => d.level);

      for (let i = 1; i <= 3; i++) {
         const level = i === 1 ? 'low' : (i === 2 ? 'medium' : 'high');
         const levelData = groupedData.get(level);
         const rank = 1;
         const countryData = levelData.find(d => +d.rank === rank);

         if (countryData) {
            const svg = d3.select("#donut_" + i)
               .append("svg")
               .attr("id", "donut_" + i + "_svg")
               .attr("width", width)
               .attr("height", height)
               .append("g")
               .attr("transform", `translate(${width/2-39.5},${height/2-35})`);

            // Calculate the total sum of male and female values for each country
            countryData.total = +countryData.valueM + +countryData.valueF;

            // Convert counts to percentages
            countryData.percentM = (+countryData.valueM / countryData.total) * 100;
            countryData.percentF = (+countryData.valueF / countryData.total) * 100;

            const data = {
               Male: countryData.percentM,
               Female: countryData.percentF
            };

            // Assuming i is the index or identifier of the element
            let countryName = countryData.name;
            let titleElement = d3.select("#title_" + i);
            let containerDiv = document.getElementById("title_" + i).parentNode;

            // Check if the country name is "North Macedonia"
            if (countryName === "North Macedonia") {
               // Update the element to h4 and add styles to the container div
               titleElement.attr("class", "h4");
               containerDiv.style.paddingTop = "10px";
               containerDiv.style.height = "252px";
            } else {
               // If it's not "North Macedonia", remove the class and styles
               titleElement.attr("class", null);
               containerDiv.style.paddingTop = null;
               containerDiv.style.height = null;
            }

            // Update the text content regardless of the country name
            titleElement.text(countryName);
            titleElement.attr("hidden", null);

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

            svg.selectAll('allSlices')
               .data(data_ready)
               .join('path')
               .attr('d', arc)
               .attr('fill', 'white') // Initially set fill to white
               .attr("stroke", "black")
               .attr("stroke-width", 1)
               .transition() // Apply transition
               .duration(1000) // Set the duration of the transition in milliseconds
               .attrTween('d', function (d) {
                  const interpolate = d3.interpolate(d.startAngle, d.endAngle);
                  return function (t) {
                     d.endAngle = interpolate(t);
                     return arc(d);
                  };
               })
               .attr('fill', d => color(d.data[0])) // Transition to the respective color
               .style("opacity", 0.7)
               .end() // After color transition ends, add text
               .then(() => {
                  svg.selectAll('.text-label') // Select existing text elements
                     .data(data_ready)
                     .join('text') // Append new text elements
                     .attr('class', 'text-label') // Assign a class for selection
                     .attr('text-anchor', 'middle')
                     .attr('fill', 'white')
                     .attr('font-size', '10px') // Adjust the font size here
                     .attr('transform', d => `translate(${arc.centroid(d)})`)
                     .text(d => `${d.data[1].toFixed(1)}%`)
                     .style('opacity', 0) // Initially set text opacity to 0
                     .transition() // Apply text transition
                     .duration(175) // Set text appearance duration
                     .style('opacity', 1); // Transition to visible state
               });
         }
      }
   });
}
updateDonuts("data/story2/donuts/donut2009.csv");
