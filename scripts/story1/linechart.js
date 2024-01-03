// Create a tooltip
const tooltip = d3.select("#linechart_1")
		  .append("section")
		    .attr("id", "linechart_tooltip")
		  .style("opacity", 0)
		  .style("background-color", "lightgray")
		  .style("border", "2px solid black")
		    .attr("class", "tooltip");

const distinctColors = [
    '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
    '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf',
    '#aec7e8', '#ffbb78', '#98df8a', '#ff9896', '#c5b0d5',
    '#c49c94', '#f7b6d2', '#c7c7c7', '#dbdb8d', '#9edae5',
    '#393b79', '#e57171', '#4caf50', '#d32f2f', '#2196f3',
    '#ff5722', '#795548', '#9c27b0', '#607d8b', '#3f51b5',
    '#009688', '#8bc34a', '#ff4081', '#00bcd4'
];
var countryColors = [];

// Function to load CSV data and create line chart
function drawLineChart(selectedCountries) {
    // Set up the SVG dimensions
    var margin = { top: 60, right: 70, bottom: 70, left: 100 },
	           width = 1435 - margin.left - margin.right,
	           height = 650 - margin.top - margin.bottom;

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

        // Set the domains of the scales
        xScale.domain(d3.extent(formattedData, function (d) { return d.year; }));
        yScale.domain([0, d3.max(formattedData, function (d) { return d.value; })]);

        // Add X-axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

        // Add Y-axis
        svg.append("g")
            .call(d3.axisLeft(yScale));

        // Add lines for each selected country
        var countries = Array.from(new Set(formattedData.map(function (d) { return d.Country; })));

	var line = d3.line()
        	.x(function (d) { return xScale(+d.year); })
        	.y(function (d) { return yScale(+d.value); });

        countries.forEach(function (country, i) {
            var countryData = formattedData.filter(function (d) {
	        return d.Country === country;
	    });

	    var countryIndex = countryColors.findIndex(item => item.country === country);
            var color = distinctColors[countryIndex];

            svg.append("path")
                .data([countryData])
                .attr("class", "line")
		.attr("fill", "none")
                .attr("stroke-width", 1.5)
                .style("stroke", color)
                .attr("d", line);

	    svg.selectAll(".circle-" + country)
	        .data(countryData)
	        .enter().append("circle")
	        .attr("class", "circles")
	        .attr("cx", function (d) { return xScale(+d.year); })
	        .attr("cy", function (d) { return yScale(+d.value); })
	        .attr("r", 4)
	        .style("fill", color)
	        .on("mouseover", handleMouseOver)
	        .on("mouseout", handleMouseOut);
	        });
    });
}

function handleMouseOver(event, d) {
    // Show the tooltip
    tooltip.transition()
        .duration(200)
        .style("opacity", 1);

    // Tooltip content
    const exactAbundance = d.value;
    tooltip.html(`Abundance: ${exactAbundance}`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 20) + "px");
}

function handleMouseOut() {
    // Hide the tooltip
    tooltip.transition()
        .duration(500)
        .style("opacity", 0);
}

// Call the drawLineChart function with the initially checked countries
var initialCheckedCountries = ["Belgium"];
drawLineChart(initialCheckedCountries);

document.getElementById("states-checkbox-form").addEventListener("change", function () {

    // Select all checked checkboxes
    const checkedCheckboxes = document.querySelectorAll("#states-checkbox-form input:checked");
    
    // Extract values of checked checkboxes
    const selectedStates = Array.from(checkedCheckboxes).map(checkbox => checkbox.value);

    d3.select("#linechart_1 svg").remove();
    drawLineChart(selectedStates);
});
