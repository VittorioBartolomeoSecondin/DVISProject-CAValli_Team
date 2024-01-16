const SlopeChart = {

   initialize: function (finalYear) {
      // Use d3.csv to load data from a CSV file
      d3.csv("data/story2/slopechart.csv").then(function (dataset) {

         // Set up SVG dimensions
         var margin = {
               top: 20,
               right: 20,
               bottom: 50,
               left: 50
            },
            width = 600 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

         var tooltip = null;

         // Create SVG element
         var svg = d3.select("#slopechart").append("svg")
            .attr("id", "slopechart_svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

         // Define colors
         var colors = d3.schemeSet1;

         // Create scales
         var xScale = d3.scaleLinear().domain([2013, finalYear]).range([0, width - 50]);
         var yScale = d3.scaleLinear().domain([15, 30]).range([height, 0]);

         var linesToBeSwapped = finalYear < 2013 ? true : false;

         // Create line function
         var line = d3.line()
            .x(function (d) {
               return xScale(d.year);
            })
            .y(function (d) {
               return yScale(d.value);
            });

         // Draw vertical lines for the years
         svg.append("line")
            .attr("x1", xScale(linesToBeSwapped ? finalYear : 2013))
            .attr("y1", 0)
            .attr("x2", xScale(linesToBeSwapped ? finalYear : 2013))
            .attr("y2", height)
            .attr("stroke", "black")
            .style("stroke-width", 4)
            .style("opacity", 0.5);

         svg.append("line")
            .attr("x1", xScale(linesToBeSwapped ? 2013 : finalYear))
            .attr("y1", 0)
            .attr("x2", xScale(linesToBeSwapped ? 2013 : finalYear))
            .attr("y2", height)
            .attr("stroke", "black")
            .style("stroke-width", 4)
            .style("opacity", 0.5);

         // Draw lines
         svg.selectAll(".line")
            .data(dataset)
            .enter().append("path")
            .attr("class", "line")
            .attr("d", function (d) {
               return line([{
                  year: linesToBeSwapped ? finalYear : 2013,
                  value: +d[(linesToBeSwapped ? finalYear : 2013).toString()]
               }, {
                  year: linesToBeSwapped ? 2013 : finalYear,
                  value: +d[(linesToBeSwapped ? 2013 : finalYear).toString()]
               }]);
            })
            .style("stroke", function (d, i) {
               return (d.sex === "M") ? colors[1] : colors[0];
            })
            .style("stroke-width", 2);

         // Draw points for both starting and final years
         svg.selectAll(".start-point")
            .data(dataset)
            .enter().append("circle")
            .attr("class", "start-point")
            .attr("cx", function (d) {
               return xScale(linesToBeSwapped ? finalYear : 2013);
            })
            .attr("cy", function (d) {
               return yScale(+d[(linesToBeSwapped ? finalYear : 2013).toString()]);
            })
            .attr("r", 7)
            .style("fill", function (d, i) {
               return (d.sex === "M") ? colors[1] : colors[0];
            })
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .on("mouseover", function (event, d) {
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

               let sex_to_be_displayed = (d.sex === "M") ? "Males" : "Females";

               tooltip.html(`<b>${sex_to_be_displayed}</b>: ${d['2013']}%`)
                  .style("left", (event.pageX + 10) + "px")
                  .style("top", (event.pageY - 20) + "px");
            })
            .on("mousemove", function (event, d) {
                  // Move the tooltip with the mouse pointer
                  tooltip.style("left", (event.pageX + 10) + "px")
                     .style("top", (event.pageY + 10) + "px");
            })
            .on("mouseout", function (d) {
               d3.select(this).attr("stroke-width", 1);

               if (tooltip) {
                  tooltip.transition()
                     .duration(500)
                     .style("opacity", 0)
                     .remove();
                  tooltip = null; // Reset tooltip variable
               }
            });

         svg.selectAll(".final-point")
            .data(dataset)
            .enter().append("circle")
            .attr("class", "final-point")
            .attr("cx", function (d) {
               return xScale(linesToBeSwapped ? 2013 : finalYear);
            })
            .attr("cy", function (d) {
               return yScale(+d[(linesToBeSwapped ? 2013 : finalYear).toString()]);
            })
            .attr("r", 7)
            .style("fill", function (d, i) {
               return (d.sex === "M") ? colors[1] : colors[0];
            })
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .on("mouseover", function (event, d) {
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

               let sex_to_be_displayed = (d.sex === "M") ? "Males" : "Females";

               tooltip.html(`<b>${sex_to_be_displayed}</b>: ${d[finalYear.toString()]}%`)
                  .style("left", (event.pageX + 10) + "px")
                  .style("top", (event.pageY - 20) + "px");
            })
            .on("mousemove", function (event, d) {
                  // Move the tooltip with the mouse pointer
                  tooltip.style("left", (event.pageX + 10) + "px")
                     .style("top", (event.pageY + 10) + "px");
            })
            .on("mouseout", function (d) {
               d3.select(this).attr("stroke-width", 1);

               if (tooltip) {
                  tooltip.transition()
                     .duration(500)
                     .style("opacity", 0)
                     .remove();
                  tooltip = null; // Reset tooltip variable
               }
            });

         // Draw labels for starting points
         svg.selectAll(".start-label")
            .data(dataset)
            .enter().append("text")
            .attr("class", "start-label")
            .attr("x", xScale(linesToBeSwapped ? finalYear : 2013) - 28)
            .attr("y", function (d) {
               return yScale(+d[(linesToBeSwapped ? finalYear : 2013).toString()]) + 5;
            })
            .text(function (d) {
               return d.sex;
            })
            .style("fill", function (d, i) {
               return (d.sex === "M") ? colors[1] : colors[0];
            });

         // Draw labels for years
         svg.append("text")
            .attr("x", xScale(linesToBeSwapped ? finalYear : 2013))
            .attr("y", height + 20)
            .text("2013")
            .attr("text-anchor", "middle");

         svg.append("text")
            .attr("x", xScale(linesToBeSwapped ? 2013 : finalYear))
            .attr("y", height + 20)
            .text(finalYear.toString())
            .attr("text-anchor", "middle");

         const yAxis = svg.append("g")
            .attr("class", "y-axis-right")
            .attr("transform", "translate(" + (width + margin.right - 50) + ",0)")
            .call(d3.axisRight(yScale).tickFormat(function (d) {
               return d + '%';
            }));

         yAxis.selectAll("text")
            .attr("fill", "black");

         svg.selectAll(".y-axis-right")
            .selectAll("line")
            .attr("stroke", "black");

      }).catch(function (error) {
         console.log(error);
      });
   },

   destroy: function () {
      const existingSvg = document.querySelector('#slopechart_svg');
      if (existingSvg)
         existingSvg.remove();


      // Remove the reference from the global object
      delete window.SlopeChart;
   }

}

// Slider interaction
const sliders_slopechart = document.querySelectorAll(".yearSlider_slopechart");
sliders_slopechart.forEach((slider) => {
   slider.addEventListener("change", function () {
      const sliders = document.querySelectorAll('.yearSlider_slopechart');
      const selectedYears = document.querySelectorAll('.selectedYear_slopechart');

      const year = parseInt(this.value);
      sliders.forEach((s) => {
         s.value = year;
      });
      selectedYears.forEach((sy) => {
         sy.innerHTML = year;
      });
      // Update the chart based on the selected year
      SlopeChart.destroy();
      SlopeChart.initialize(year);
   });
});

SlopeChart.initialize(2013);
