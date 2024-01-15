function createPieChartLegend() {
   var legendContainer = d3.select("#pie_chart_legend");

   // Data for legend items
   var legendData = [{
         level: 'Re-entrants',
         color: '#259C1F'
      },
      {
         level: 'Short-term unemployed',
         color: '#20EACC'
      },
      {
         level: 'Long-term unemployed',
         color: '#FF9E00'
      },
      {
         level: 'Illness/Disability',
         color: '#EFE50D'
      },
      {
         level: 'Family responsibilities',
         color: '#a05d56'
      },
      {
         level: 'Discouraged',
         color: '#FF5733'
      },
      {
         level: 'Other NEETs',
         color: '#b1b2b5'
      }
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
      .style("background-color", function (d) {
         return d.color;
      });

   // Add level names to legend
   legendItems.append("div")
      .attr("class", "legend-text")
      .text(function (d) {
         return d.level;
      });
}

function initializePieChart() {
   // Set the dimensions and margins of the graph
   const width = 600,
      height = 450,
      margin = 40;
   
   // The radius of the pie plot is half the width or half the height (the smallest one). Subtract a bit of margin.
   const radius = Math.min(width, height) / 2 - margin;
   
   // Append the svg object
   const svg = d3.select("#pie_chart")
      .append("svg")
      .attr("id", "pie_chart_svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width/2+80}, ${height/2})`);
   
   // Create data
   const data = {
      "Re-entrants: will soon leave the NEET group": 7.8,
      "Short-term unemployed (less than a year)": 29.8,
      "Long-term unemployed (more than a year)": 22,
      "Illness/Disability": 6.8,
      "Family responsibilities: caring for children or incapacitated adults": 15.4,
      "Discouraged: believing that there are no job opportunities": 5.8,
      "Other NEETs": 12.5
   }
   
   // Set the color scale
   const color = d3.scaleOrdinal()
      .range(["#259C1F", "#20EACC", "#FF9E00", "#EFE50D", "#a05d56", "#FF5733", "#b1b2b5"])
   
   // Compute the position of each group on the pie:
   const pie = d3.pie()
      .value(function (d) {
         return d[1]
      })
   const data_ready = pie(Object.entries(data))
   
   // Shape helper to build arcs:
   const arcGenerator = d3.arc()
      .innerRadius(0)
      .outerRadius(radius)
   
   // Shape helper to build arcs:
   const arcGenerator2 = d3.arc()
      .innerRadius(0)
      .outerRadius(radius + radius / 2)
   
   // Build the pie chart: basically, each part of the pie is a path that we build using the arc function.
   svg
      .selectAll('myPie')
      .data(data_ready)
      .join('path')
      .attr('d', arcGenerator)
      .attr("class", "Slice")
      .attr('fill', function (d) {
         return (color(d.data[1]))
      })
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .style("opacity", 0.7)
      .on("mouseover", function (event, d) {
         d3.selectAll(".Slice").style("opacity", 0.1);
         d3.selectAll(".Slice_text").style("font-weight", "bold");
         d3.select(this).attr("stroke-width", 4).style("opacity", 1);
   
         if (!tooltip) {
            tooltip = d3.select("body").append("div")
               .attr("id", "pie_chart_tooltip")
               .attr("class", "tooltip")
               .style("opacity", 0);
         }
   
         // Show the tooltip
         tooltip.transition()
            .duration(200)
            .style("opacity", 1)
   
         // Set the customized tooltip content
         tooltip.html(`<b>${d.data[0]}</b>`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 20) + "px");
      })
      .on("mousemove", function (event, d) {
         // Move the tooltip with the mouse pointer
         tooltip.style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY + 10) + "px");
      })
      .on("mouseout", function (event, d) {
         d3.selectAll(".Slice").style("opacity", 0.7);
         d3.selectAll(".Slice_text").style("font-weight", "normal");
         d3.select(this).attr("stroke-width", 2);
   
         if (tooltip) {
            tooltip.transition()
               .duration(500)
               .style("opacity", 0)
               .remove();
            tooltip = null; // Reset tooltip variable
         }
      });
   
   // Now add the annotation. Use the centroid method to get the best coordinates
   svg
      .selectAll('myPie')
      .data(data_ready)
      .join('text')
      .attr("class", "Slice_text")
      .text(function (d) {
         return d.data[1] + "%"
      })
      .attr("transform", function (d) {
         return `translate(${arcGenerator2.centroid(d)})`
      })
      .style("text-anchor", "middle")
      .style("font-size", 14);
   
   createPieChartLegend();
}

initializePieChart();
