const Barcharts = {
    initialize: function(selectedDataset) {
        const margin = {top: 20, right: 40, bottom: 70, left: 160};
        const width = 450 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;
        const orangeColors = d3.schemeOranges[6];
        const colorDictionary = {
            "< 100k": orangeColors[0],
            "100k - 200k": orangeColors[1],
            "200k - 500k": orangeColors[2],
            "500k - 1000k": orangeColors[3],
            "1000k - 1500k": orangeColors[4],
            "1500k +": orangeColors[5]
        };

        // Load the CSV file using d3.csv
        d3.csv(selectedDataset).then(function(data) {
            var groupData = {};
            
            // Nest the data based on the 'group' column
            var nestedData = d3.group(data, (d) => d.group);
          
            // Extract subdatasets based on the groups
            var groupValues = Array.from(nestedData.keys());
        
            Object.keys(colorDictionary).forEach(function(key) {
                groupValues.forEach(function(g) {
                    if (key === g) 
                      groupData[key] = nestedData.get(g);
                });
            });
      
            var i = 0;
            Object.keys(groupData).forEach(function(key) {
                // Append the svg object to the body of the page
                let svg = d3.select("#barchart_" + i)
                              .append("svg")
                                .attr("id", "barchart_svg_" + i)
                                .attr("width", width + margin.left + margin.right)
                                .attr("height", height + margin.top + margin.bottom)
                              .append("g")
                                .attr("transform", `translate(${margin.left}, ${margin.top})`);
      
                // Create the tooltip element
                let tooltip = d3.select("#barchart_" + i)
                                  .append("section")
                                    .attr("id", "barchart_tooltip_" + i)
                                  .style("opacity", 0)
                                  .style("background-color", "lightgray")
                                  .style("border", "2px solid black")
                                    .attr("class", "tooltip");
              
                // Define maximum
                let max = d3.max(groupData[key], (d) => +Math.floor(d.abundance*1000));
              
                // Add X axis
                let x = d3.scaleLinear()
                            .domain([0, max + max/10])
                            .range([0, width]);
              
                svg.append("g")
                     .attr("class", "axis")
                     .attr("transform", `translate(0, ${height})`)
                   .call(d3.axisBottom(x))
                   .selectAll("text")
                     .attr("transform", "translate(-10,0)rotate(-45)")
                   .style("text-anchor", "end");
                
                // Add Y axis
                let y = d3.scaleBand()
                            .range([height, 0])
                            .domain(groupData[key].map((d) => d.abbreviation))
                            .padding(.1);
            
                svg.append("g")
                   .attr("class", "axis")
                   .call(d3.axisLeft(y));
            
                // Show the bars
                svg.selectAll("myRect")
                   .data(groupData[key])
                   .enter()
                   .append("rect")
                     .attr("x", x(0))
                     .attr("y", (d) => y(d.abbreviation))
                     .attr("width", 0)
                     .attr("height", y.bandwidth())
                     .attr("fill", colorDictionary[key])
                     .attr("stroke", "black") 
                     .attr("stroke-width", 1) 
                   .on("mouseover", function (event, d) {
          
                   // Change stroke width when hovering
                   d3.select(this).attr("stroke-width", 2);
          
                   // Show the tooltip
                   tooltip.transition()
                          .duration(200)
                          .style("opacity", 1)
                          .style("background-color", "lightgray")
                          .style("border", "2px solid black");
                   
                   // Customize the tooltip content
                   tooltip.html(`${d.name}: ${Math.floor(d.abundance*1000)} NEETs`)
                          .style("left", (event.pageX + 40) + "px")
                          .style("top", (event.pageY - 40) + "px");
          
                   })
                   .on("mousemove", function (event, d) {
          
                   // Move the tooltip with the mouse pointer
                   tooltip.style("left", (event.pageX + 10) + "px")
                          .style("top", (event.pageY + 10) + "px");
          
                   })
                   .on("mouseout", function (d) {
          
                   // Returning to original stroke width when not hovering
                   d3.select(this).attr("stroke-width", 1);
          
                   // Hide the tooltip
                   tooltip.transition()
                          .duration(500)
                          .style("opacity", 0);           
                   });  
          
                // Animation
                svg.selectAll("rect")
                    .transition()
                    .duration(1000)
                      .attr("x", x(0))
                      .attr("width", (d) => x(Math.floor(d.abundance*1000)))
                    .delay((d, i) => i * 100);
      
                i++;
            });
        });
    },
    destroy: function() {
        // Clean up existing svg elements
        for (let i = 0; i < 6; i++) {
            const existingSvg = document.querySelector(`#barchart_svg_${i}`);
            if (existingSvg)
                existingSvg.parentNode.removeChild(existingSvg);
            
            const existingTooltip = document.querySelector(`#barchart_tooltip_${i}`);
            if (existingTooltip)
                existingTooltip.parentNode.removeChild(existingTooltip);
        }
    
        // Remove the reference from the global object
        delete window.Barcharts;
    }
};

Barcharts.initialize("data/story1/barcharts/barchart2009.csv");
