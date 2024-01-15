// set the dimensions and margins of the graph
const width = 450,
    height = 450,
    margin = 40;

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
const radius = Math.min(width, height) / 2 - margin;

// append the svg object
const svg = d3.select("#pie_chart")
  .append("svg")
  .attr("id", "pie_chart_svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", `translate(${width/2}, ${height/2})`);

// Create data
const data = {a: 7.8, b: 29.8, c:22, d:6.8, e:15.4, f:5.8, g:12.5}

// set the color scale
const color = d3.scaleOrdinal()
  .range(["#259C1F", "#20EACC", "#6608CA", "#EFE50D", "#a05d56", "#FF5733","#FF9E00"])

// Compute the position of each group on the pie:
const pie = d3.pie()
  .value(function(d) {return d[1]})
const data_ready = pie(Object.entries(data))

// shape helper to build arcs:
const arcGenerator = d3.arc()
  .innerRadius(0)
  .outerRadius(radius)

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
svg
  .selectAll('myPie')
  .data(data_ready)
  .join('path')
  .attr('d', arcGenerator)
  .attr("class", "Slice")
  .attr('fill', function(d){ return(color(d.data[1])) })
  .attr("stroke", "black")
  .style("stroke-width", "2px")
  .style("opacity", 0.7)
  .on("mouseover", function (event, d) {
	    d3.selectAll(".Slice").style("opacity", 0.1);
            d3.select(this).attr("stroke-width", 4).style("opacity", 1);

            /*if (!tooltip) {
               tooltip = d3.select("body").append("div")
                  .attr("id", "scatterplot_tooltip")
                  .attr("class", "tooltip")
                  .style("opacity", 0);
            }

            // Show the tooltip
            tooltip.transition()
               .duration(200)
               .style("opacity", 1)

            // Set the customized tooltip content
            tooltip.html(`<b>${d.Country} (${d.Abbreviation})</b> <br>
    			       NEETs: ${d.neet}% <br>
			       Persons at risk of poverty: ${d.poverty}%`)
               .style("left", (event.pageX + 10) + "px")
               .style("top", (event.pageY - 20) + "px");*/
         })
         .on("mouseout", function (event, d) {
	    d3.selectAll(".Slice").style("opacity", 0.7);
            d3.select(this).attr("stroke-width", 2);

            /*if (tooltip) {
               tooltip.transition()
                  .duration(200)
                  .style("opacity", 0)
                  .remove();
               tooltip = null; // Reset tooltip variable
*/
           //}
         });

// Now add the annotation. Use the centroid method to get the best coordinates
svg
  .selectAll('myPie')
  .data(data_ready)
  .join('text')
  .text(function(d){ return d.data[1] + "%"})
  .attr("transform", function(d) { return `translate(${arcGenerator.centroid(d)})`})
  .style("text-anchor", "middle")
  .style("font-size", 17);
