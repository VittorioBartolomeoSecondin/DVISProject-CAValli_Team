// Create a tooltip
let tooltip = null;
var lineColors = [];

const distinctColors = [
   '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
   '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf',
   '#aec7e8', '#ffbb78', '#98df8a', '#ff9896', '#c5b0d5',
   '#c49c94', '#f7b6d2', '#c7c7c7', '#dbdb8d', '#9edae5',
   '#393b79', '#e57171', '#4caf50', '#d32f2f', '#2196f3',
   '#ff5722', '#795548', '#9c27b0', '#607d8b', '#3f51b5',
   '#009688', '#8bc34a', '#ff4081', '#00bcd4'
];


// Function to load CSV data and create line chart
function drawLineChart(selectedCountries) {

   // Set up the SVG dimensions
   var margin = {
         top: 60,
         right: 70,
         bottom: 70,
         left: 50
      },
      width = 775 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

   // Append an SVG element to the specified div
   var svg = d3.select("#linechart_1")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

   // Set up the X and Y scales
   var xScale = d3.scaleLinear()
      .range([0, width]);

   var yScale = d3.scaleLinear()
      .range([height, 0]);

   // Load the CSV data
   d3.csv("data/story1/linechart.csv").then(function (data) {
      // Filter data based on selected countries
      var filteredData = data.filter(function (d) {
         return selectedCountries.includes(d.Country);
      });

      // Format the data
      var years = Object.keys(filteredData[0]).filter(function (key) {
         return key !== "Country" && key !== "Abbreviation";
      });

      var formattedData = [];
      filteredData.forEach(function (d) {
         years.forEach(function (year) {
            formattedData.push({
               Country: d.Country,
               year: year,
               value: +d[year]
            });
         });
      });

      // Compute the extent of years in the formattedData
      var yearsExtent = d3.extent(formattedData, function (d) {
         return d.year;
      });

      // Add some padding to the extent if needed
      var extentPadding = 0.5; // Adjust this value as needed
      var minYear = yearsExtent[0] - extentPadding;
      var maxYear = yearsExtent[1];

      // Set the x-axis scale domain
      xScale.domain([minYear, maxYear]);

      yScale.domain([0, d3.max(formattedData, function (d) { return d.value; }) + 20]);

      // Add X-axis
      svg.append("g")
         .attr("class", "axis")
         .attr("transform", "translate(0," + height + ")")
         .call(d3.axisBottom(xScale).tickFormat(d3.format("d")))
         .selectAll("text")
         .attr("fill", "black");

      // Add Y-axis
      svg.append("g")
         .attr("class", "axis")
         .call(
            d3.axisLeft(yScale).tickFormat(function (d) {
               return d === 0 ? d : d + "k";
            })
         )
         .selectAll("text")
         .attr("fill", "black");

      // Select lines of X,Y axes
      svg.selectAll(".axis")
         .selectAll("line")
         .attr("stroke", "black");

      // Add lines for each selected country
      var countries = Array.from(new Set(formattedData.map(function (d) {
         return d.Country;
      })));

      var line = d3.line()
         .x(function (d) {
            return xScale(+d.year);
         })
         .y(function (d) {
            return yScale(+d.value);
         });

      countries.forEach(function (country, i) {
         var countryData = formattedData.filter(function (d) {
            return d.Country === country && !isNaN(d.value);
         });

         var countryIndex = data.findIndex(item => item.Country === country);
         var color = distinctColors[countryIndex];
         lineColors.push({
            country: country,
            color: color
         });

         var lineElement = svg.append("path")
            .data([countryData])
            .attr("class", "line-" + country)
            .attr("fill", "none")
            .attr("stroke-width", 1.5)
            .style("stroke", color)
            .attr("d", line);

         svg.selectAll(".circle-" + country)
            .data(countryData)
            .enter().append("circle")
            .attr("class", "circles")
            .attr("cx", function (d) {
               return xScale(+d.year);
            })
            .attr("cy", function (d) {
               return yScale(+d.value);
            })
            .attr("r", 6)
            .style("fill", color)
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .on("mouseover", LineChartMouseOver)
            .on("mouseout", LineChartMouseOut);
      });

      createLineChartLegend();
   });
}

function LineChartMouseOver(event, d) {
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

   tooltip.html(`Country: <b>${d.Country}</b><br>
		    Abundance: ${d.value}k NEETs<br>
                    Year: ${d.year}`)
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 20) + "px");
}

function LineChartMouseOut() {
   d3.select(this).attr("stroke-width", 1);

   if (tooltip) {
      tooltip.transition()
         .duration(500)
         .style("opacity", 0)
         .remove();
      tooltip = null; // Reset tooltip variable
   }
}

function createLineChartLegend() {
   var legendContainer = d3.select("#linechart_1_legend");

   // Create legend items
   var legendItems = legendContainer.selectAll(".legend-item")
      .data(lineColors)
      .enter().append("div")
      .attr("class", "legend-item");

   // Add color boxes to legend
   legendItems.append("div")
      .attr("class", "legend-color-box")
      .style("background-color", function (d) {
         return d.color;
      });

   // Add country names to legend
   legendItems.append("div")
      .attr("class", "legend-text")
      .text(function (d) {
         return d.country;
      });
}


// Call the drawLineChart function with the initially checked countries
var initialCheckedCountries = ["Belgium"];
drawLineChart(initialCheckedCountries);

document.getElementById("states-checkbox-form").addEventListener("change", function () {

   // Select all checked checkboxes
   const checkedCheckboxes = document.querySelectorAll("#states-checkbox-form input:checked");

   // Extract values of checked checkboxes
   const selectedStates = Array.from(checkedCheckboxes).map(checkbox => checkbox.value);

   d3.select("#linechart_1_legend").selectAll("*").remove();
   d3.select("#linechart_1 svg").remove();
   lineColors = [];
   drawLineChart(selectedStates);
});

function LineChartCheckboxChange(checkbox) {
   var checkedCheckboxes = document.querySelectorAll('.form-check-input:checked');

   if (checkedCheckboxes.length > 5) {
      alert('Maximum 5 checkboxes allowed!');
      // Uncheck the last checkbox
      checkbox.checked = false;
   }

   if (checkedCheckboxes.length === 0) {
      alert('Minimum 1 checkbox required!');
      // Check the current checkbox
      checkbox.checked = true;
   }
}
