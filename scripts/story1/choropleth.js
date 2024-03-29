const Choropleth = {
   // Fields to be updated when another year is selected
   tooltip: null,
   world: null,
   path: null,
   colorScale: null,
   mouseLeave: null,

   initialize: function () {
      // Set the dimensions and margins of the graph
      var margin = {
            top: 60,
            right: 70,
            bottom: 70,
            left: 100
         },
         width = 1435 - margin.left - margin.right,
         height = 650 - margin.top - margin.bottom;

      // Define the width and height of the legend
      const legendWidth = 110;
      const legendHeight = 300;

      // Calculate the position for the legend
      const legendX = width - legendWidth - 80;
      const legendY = height / 2 - legendHeight / 2 - 300;

      let projection = d3.geoAlbers()
         .rotate([-20.0, 0.0])
         .center([0.0, 52.0])
         .parallels([35.0, 65.0])
         .translate([width / 2, height / 2 + 250])
         .scale(width)
         .precision(.1);

      const self = this; // saving a reference to the Choropleth object

      this.mouseLeave = function () {
         d3.selectAll(".Country")
            .transition()
            .duration(200)
            .style("opacity", 1)
            .style("stroke-width", "0.75px");
         if (self.tooltip) {
            self.tooltip.transition().duration(500)
               .style("opacity", 0)
               .remove();
            self.tooltip = null; // Reset tooltip variable
         }
      }

      this.path = d3.geoPath().projection(projection);

      // Define color scale
      this.colorScale = d3.scaleThreshold()
         .domain([100000, 200000, 500000, 1000000, 1500000])
         .range(d3.schemeOranges[6]);

      let svg = d3.select("#choropleth")
         .append("svg")
         .attr("width", width)
         .attr("height", height)
         .attr("preserveAspectRatio", "xMinYMin meet")
         .attr("viewBox", `0 0 ${width} ${height}`);

      this.world = svg.append("g");

      // Add the stripe pattern to the SVG
      const defs = svg.append("defs");

      defs.append("pattern")
         .attr("id", "stripe")
         .attr("patternUnits", "userSpaceOnUse")
         .attr("width", 8)
         .attr("height", 8)
         .attr("patternTransform", "rotate(45)")
         .append("rect")
         .attr("width", 4)
         .attr("height", 8)
         .attr("transform", "translate(0,0)")
         .attr("opacity", 0.5)
         .attr("fill", "grey");

      // Legend
      const x = d3.scaleLinear()
         .domain([2.6, 75.1])
         .rangeRound([600, 860]);

      const legend = svg.append("g")
         .attr("class", "choropleth-legend")
         .attr("transform", `translate(${legendX}, ${legendY})`);

      const legend_entry = legend.selectAll("g.legend")
         .data(this.colorScale.range().map(function (d) {
            d = self.colorScale.invertExtent(d);
            if (d[0] == null) d[0] = x.domain()[0];
            if (d[1] == null) d[1] = x.domain()[1];
            return d;
         }))
         .enter().append("g")
         .attr("class", "legend_entry");

      const ls_w = 30,
         ls_h = 30;

      legend_entry.append("rect")
         .attr("x", 20)
         .attr("y", function (d, i) {
            return height - (i * ls_h) - 2 * ls_h;
         })
         .attr("width", ls_w)
         .attr("height", ls_h)
         .style("fill", function (d) {
            return self.colorScale(d[0]);
         });

      legend_entry.append("text")
         .attr("x", 65)
         .attr("y", function (d, i) {
            return height - (i * ls_h) - ls_h - 6;
         })
         .text(function (d, i) { 
            if (i === 0) return "< " + d[1] / 1000 + "k";
            if (d[1] < d[0]) return d[0] / 1000 + "k +";
            return d[0] / 1000 + "k - " + d[1] / 1000 + "k";
         });

      legend.append("text").attr("x", 15).attr("y", 290).text("NEET abundance");

      this.updateMap(0);
   },
   updateMap: function (yearIndex) {
      const self = this;
      let mouseOver = function (event, d) {
         d3.selectAll(".Country")
            .transition()
            .duration(200)
            .style("opacity", .3)
            .style("stroke", "black")
            .style("stroke-width", "0.75px");
         d3.select(this)
            .transition()
            .duration(200)
            .style("opacity", 1)
            .style("stroke-width", "2px");
         // Create the tooltip if it doesn't exist
         if (!self.tooltip) {
            self.tooltip = d3.select("body").append("div")
               .attr("class", "tooltip")
               .style("opacity", 0);
         }
         let value = d.properties.abundance1000[yearIndex]
         let description = value != 0 ? ': ' + value + 'k NEETs' : '';
         self.tooltip.html(`<b>${d.properties.name}</b> (${d.properties.abbreviation})${description}`)
            .style("left", (event.pageX + 15) + "px")
            .style("top", (event.pageY - 28) + "px")
            .transition().duration(200)
            .style("opacity", 1);
      }
      fetch("data/story1/choropleth.json")
         .then(response => response.json())
         .then(data => {
            const dataFeatures = topojson.feature(data, data.objects.europe).features;
            self.world.selectAll(".Country").remove(); // Remove previous paths (if any)
            self.world.selectAll(".states")
               .data(dataFeatures)
               .enter().append("path")
               // Add a class, styling and mouseover/mouseleave
               .attr("d", this.path)
               .style("stroke", "black")
               .attr("class", "Country")
               .style("fill", function (d) {
                  let value = d.properties.abundance[yearIndex];
                  return value !== 0 ? self.colorScale(value) : "url(#stripe)";
               })
               .style("opacity", 1)
               .style("stroke-width", "0.75px")
               .on("mouseover", mouseOver)
               .on("mousemove", function (event, d) {

                  // Move the tooltip with the mouse pointer
                  self.tooltip.style("left", (event.pageX + 10) + "px")
                     .style("top", (event.pageY + 10) + "px");

               })
               .on("mouseleave", self.mouseLeave);
         })
         .catch(error => {
            console.error("Error fetching the data:", error);
         });
   }
}
// Slider interaction
const sliders = document.querySelectorAll(".yearSlider:not(.yearSlider_slopechart):not(.yearSlider_italy)");
const selectedYears = document.querySelectorAll(".selectedYear:not(.selectedYear_slopechart):not(.selectedYear_italy)");
sliders.forEach((slider) => {
   slider.addEventListener("input", function () {
      const year = parseInt(this.value);
      const selectedYear = this.nextElementSibling; // Assuming the display element is right after the slider
      selectedYear.innerHTML = year;
      // Call the update function for the map based on the selected year
      Choropleth.updateMap(year - 2009);
   });
   slider.addEventListener("change", function () {
      const year = parseInt(this.value);
      sliders.forEach((s) => {
         s.value = year;
      });
      selectedYears.forEach((sy) => {
         sy.innerHTML = year;
      });
      // Update the chart based on the selected year
      Barcharts.destroy();
      Barcharts.initialize("data/story1/barcharts/barchart" + year + ".csv");

      Butterfly.destroy();
      Butterfly.initialize("data/story1/butterfly/butterfly" + year + ".csv");
   });
});

Choropleth.initialize();
