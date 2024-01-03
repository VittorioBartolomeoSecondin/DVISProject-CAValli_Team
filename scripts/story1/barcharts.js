const Barcharts = {
    // constant properties
    margin: {top: 20, right: 40, bottom: 70, left: 160},
    width: 450 - this.margin.left - this.margin.right,
    height: 400 - this.margin.top - this.margin.bottom,
    orangeColors: d3.schemeOranges[6],
    colorDictionary: {
        "< 100k": this.orangeColors[0],
        "100k - 200k": this.orangeColors[1],
        "200k - 500k": this.orangeColors[2],
        "500k - 1000k": this.orangeColors[3],
        "1000k - 1500k": this.orangeColors[4],
        "1500k +": this.orangeColors[5]
    },

    // Parse the Data
    initialize: function(selectedDataset) {
        // Load the CSV file using d3.csv
        d3.csv(selectedDataset).then((data) => {
            var groupData = {};
            
            // Nest the data based on the 'group' column
            var nestedData = d3.group(data, (d) => d.group);
          
            // Extract subdatasets based on the groups
            var groupValues = Array.from(nestedData.keys());
        
            Object.keys(this.colorDictionary).forEach((key) => {
                groupValues.forEach((g) => {
                    if (key === g) 
                      groupData[key] = nestedData.get(g);
                });
            });
      
            var i = 0;
            Object.keys(groupData).forEach((key) => {
                // Append the svg object to the body of the page
                let svg = d3.select("#barchart_" + i)
                              .append("svg")
                                .attr("id", "barchart_svg_" + i)
                                .attr("width", this.width + this.margin.left + this.margin.right)
                                .attr("height", this.height + this.margin.top + this.margin.bottom)
                              .append("g")
                                .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
      
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
                            .range([0, this.width]);
              
                svg.append("g")
                     .attr("class", "axis")
                     .attr("transform", `translate(0, ${this.height})`)
                   .call(d3.axisBottom(x))
                   .selectAll("text")
                     .attr("transform", "translate(-10,0)rotate(-45)")
                   .style("text-anchor", "end");
                
                // Add Y axis
                let y = d3.scaleBand()
                            .range([this.height, 0])
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
                     .attr("fill", this.colorDictionary[key])
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
        for (let i = 0; i < 6; i++) { // Assuming indices from 0 to 5 for charts and tooltips
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
}

Barcharts.initialize("data/story1/barcharts/barchart2009.csv");
