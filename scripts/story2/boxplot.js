const BoxPlot = {
   initialize: function () {
      // Set the dimensions and margins of the graph
      var margin = {
            top: 10,
            right: 30,
            bottom: 30,
            left: 70
         },
         width = 750 - margin.left - margin.right,
         height = 1000 - margin.top - margin.bottom;

      var tooltip = null;

      // Append the svg object to the div of the chart
      var svg = d3.select("#boxplot")
         .append("svg")
         .attr("width", width + margin.left + margin.right)
         .attr("height", height + margin.top + margin.bottom)
         .append("g")
         .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

      // Read the data and compute summary statistics for each country
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

            return {
               key: key,
               points: values,
               n_values: values.length,
               value: {
                  q1: q1,
                  median: median,
                  q3: q3,
                  interQuantileRange: interQuantileRange,
                  min: min,
                  max: max,
                  mean: mean
               }
            }
         });

         // Show the Y scale
         var y = d3.scaleBand()
            .range([0, height])
            .domain(data.map(d => d.country).filter((value, index, self) => self.indexOf(value) === index))
            .paddingInner(1)
            .paddingOuter(.5)
         svg.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y))
            .selectAll("text")
            .attr("fill", "black")
            .style("text-anchor", "end");

         // Show the X scale
         var x = d3.scaleLinear()
            .domain([0, 70])
            .range([0, width])
         svg.append("g").attr("class", "axis").attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickFormat(function (d) {
               return d + '%';
            }))
            .selectAll("text")
            .attr("fill", "black");

         // Select lines of X,Y axes
         svg.selectAll(".axis")
            .selectAll("line")
            .attr("stroke", "black");

         svg.selectAll("line.grid-line")
            .data(y.domain()) // Use y.domain() to get the unique values for the band scale
            .enter()
            .append("line")
            .attr("class", "grid-line")
            .attr("x1", 0)
            .attr("x2", width)
            .attr("y1", d => y(d) + y.bandwidth() / 2)
            .attr("y2", d => y(d) + y.bandwidth() / 2)
            .attr("stroke", "rgba(0, 0, 0, 0.1)");

         svg.selectAll("line.grid-line-x")
            .data(x.ticks())
            .enter()
            .append("line")
            .attr("class", "grid-line-x")
            .attr("x1", d => x(d))
            .attr("x2", d => x(d))
            .attr("y1", 0)
            .attr("y2", height)
            .attr("stroke", "rgba(0, 0, 0, 0.1)");

         // Show the main horizontal line
         svg
            .selectAll("horizLines")
            .data(sumstat)
            .enter()
            .append("line")
            .attr("x1", function (d) {
               return (x(d.value.min))
            })
            .attr("x2", function (d) {
               return (x(d.value.max))
            })
            .attr("y1", function (d) {
               return (y(d.key) + y.bandwidth() / 2)
            })
            .attr("y2", function (d) {
               return (y(d.key) + y.bandwidth() / 2)
            })
            .attr("stroke", "black")
            .style("width", 40)

         // Rectangle for the main box
         var boxHeight = 25
         svg
            .selectAll("boxes")
            .data(sumstat)
            .enter()
            .append("rect")
            .attr("x", function (d) {
               return (x(d.value.q1))
            })
            .attr("y", function (d) {
               return (y(d.key) - boxHeight / 2)
            })
            .attr("width", function (d) {
               return (x(d.value.q3) - x(d.value.q1))
            })
            .attr("height", boxHeight)
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .style("fill", "#69b3a2")
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

               tooltip.html(`Computed on ${d.n_values} points<br>
                                  <i>Mean</i>: ${d.value.mean.toFixed(1)}%<br><br>
                                  <b>Lower bound</b>: ${d.value.min.toFixed(1)}%<br>
                                  <b>Median</b>: ${d.value.median.toFixed(1)}%<br>
                                  <b>Upper bound</b>: ${d.value.max.toFixed(1)}%`)
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

         // Show the median
         svg
            .selectAll("medianLines")
            .data(sumstat)
            .enter()
            .append("line")
            .attr("x1", function (d) {
               return (x(d.value.median))
            })
            .attr("x2", function (d) {
               return (x(d.value.median))
            })
            .attr("y1", function (d) {
               return (y(d.key) - boxHeight / 2)
            })
            .attr("y2", function (d) {
               return (y(d.key) + boxHeight / 2)
            })
            .attr("stroke", "red")
            .style("width", 80)
      });
   }
}

BoxPlot.initialize();
