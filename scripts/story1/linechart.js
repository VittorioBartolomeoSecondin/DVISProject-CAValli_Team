// set the dimensions and margins of the graph
var margin = { top: 60, right: 70, bottom: 70, left: 100 },
	           width = 1435 - margin.left - margin.right,
	           height = 650 - margin.top - margin.bottom;

// Create a tooltip
const tooltip = d3.select("#linechart_1")
                  .append("section")
                    .attr("id", "linechart_tooltip")
                  .style("opacity", 0)
                  .style("background-color", "lightgray")
                  .style("border", "2px solid black")
                    .attr("class", "tooltip");

var linechart_svg;

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
