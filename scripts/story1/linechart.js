// Read the CSV data and initialize the chart
d3.csv("data/story1/linechart.csv").then(function (data) {
	// Extract unique states from the data
	const states = Array.from(new Set(data.map(d => d.State)));

	// Populate the state selector dropdown
	const stateSelector = d3.select("#states-dropdown");
	states.forEach(state => {
    		stateSelector.append("option").text(state).attr("value", state);
	});

// Initialize the chart with the first state
updateLineChart();
});

function updateLineChart() {
        const selectedStates = document.querySelectorAll("#states-checkbox-form input:checked");

        // Filter data for the selected state
        const filteredData = data.filter(d => d.State === selectedStates);

        // Remove the previous chart
        d3.select("#linechart_svg").remove();

        // Append a new SVG for the chart
        linechart_svg = d3.select("#linechart_1").append("svg")
            .attr("id", "linechart_svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Create x and y scales
        const xScale = d3.scaleBand()
            .domain(filteredData.columns.slice(1))
            .range([0, width])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(filteredData, d => d3.max(filteredData.columns.slice(1), key => +d[key]))])
            .range([height, 0]);

        // Create the line generator
        const line = d3.line()
            .x(d => xScale(d[0]))
            .y(d => yScale(+d[1]));

        // Draw the line
        linechart_svg.append("path")
            .datum(filteredData.columns.slice(1).map(year => [year, +filteredData[0][year]]))
            .attr("class", "line")
            .attr("d", line);
    }


document.getElementById("states-checkbox-form").addEventListener("change", function () {

    // Select all checked checkboxes
    const checkedCheckboxes = document.querySelectorAll("#states-checkbox-form input:checked");
    
    // Extract values of checked checkboxes
    const selectedStates = Array.from(checkedCheckboxes).map(checkbox => checkbox.value);

    d3.select("#linechart_svg").remove();
    updateLineChart(selectedStates);
});

// linechart.js

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
    var xScale = d3.scaleLinear().range([0, width]);
    var yScale = d3.scaleLinear().range([height, 0]);

    // Set up the line function
    var line = d3.line()
        .x(function (d) { return xScale(+d.year); })
        .y(function (d) { return yScale(+d.value); });

    // Load the CSV data
    d3.csv("your_dataset.csv").then(function (data) {
        // Filter data based on selected countries
        var filteredData = data.filter(function (d) {
            return selectedCountries.includes(d.Abbreviation);
        });

        // Format the data
        var years = Object.keys(filteredData[0]).filter(function (key) {
            return key !== "Country" && key !== "Abbreviation";
        });

        var formattedData = [];
        filteredData.forEach(function (d) {
            years.forEach(function (year) {
                formattedData.push({
                    Abbreviation: d.Abbreviation,
                    year: +year,
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
            .call(d3.axisBottom(xScale));

        // Add Y-axis
        svg.append("g")
            .call(d3.axisLeft(yScale));

        // Add lines for each selected country
        var countries = Array.from(new Set(formattedData.map(function (d) { return d.Abbreviation; })));
        var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        countries.forEach(function (country, i) {
            var countryData = formattedData.filter(function (d) {
                return d.Abbreviation === country;
            });

            svg.append("path")
                .data([countryData])
                .attr("class", "line")
                .style("stroke", colorScale(i))
                .attr("d", line);
        });
    });
}

// Call the drawLineChart function with the initially checked countries
var initialCheckedCountries = ["BEL"];  // Adjust this based on your initial state
drawLineChart(initialCheckedCountries);
