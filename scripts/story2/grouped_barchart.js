// Create the tooltip element
let tooltip = null;

// Set up the SVG dimensions
var margin = { top: 30, right: 70, bottom: 90, left: 100 },
		width = 900 - margin.left - margin.right,
		height = 625 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#grouped_barchart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",`translate(${margin.left},${margin.top})`);

// Parse the Data
d3.csv("data/story2/grouped_barcharts/grouped_barchart_allK.csv").then( function(data) {

  // Extract the headers excluding the first column
  const subgroups = data.columns.slice(1, 6)

  // Extract the group labels from the 'age' column
  const groups = data.map(d => d.age);

  // Add X axis
  const x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.2])
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickSize(0));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d3.max(subgroups, key => +d[key]))])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Another scale for subgroup position?
  const xSubgroup = d3.scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05])

  // color palette = one color per subgroup
  const color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00']);

  // Show the bars
  svg.append("g")
    .selectAll("g")
    // Enter in data = loop group per group
    .data(data)
    .join("g")
      .attr("transform", d => `translate(${x(d.age)}, 0)`)
    .selectAll("rect")
    .data(function(d) { return subgroups.map(function(key) { return {key: key, value: +d[key]}; }); })
    .join("rect")
      .attr("x", d => xSubgroup(d.key))
      .attr("y", d => y(d.value))
      .attr("width", xSubgroup.bandwidth())
      .attr("height", d => height - y(d.value))
      .attr("fill", d => color(d.key))
      .on("mouseover", function(event, d) {   
	if (!tooltip) {
		tooltip = d3.select("body").append("div")
			.attr("id", "grouped_barchart_tooltip")
			.attr("class", "tooltip")
			.style("opacity", 0);
	}
	      
	// Determine the content based on the subgroup
	let tooltipContent = "";
	switch(d.key) {
		case "Primary education":
			tooltipContent = "Primary education";
			break;
		case "Lower secondary education":
			tooltipContent = `Lower secondary education:<br>` + 
					`Lower secondary general education: ${d3.format(",")(d3.select(this.parentNode).datum()["Lower secondary general education"])}<br>` + 
					`Lower secondary vocational education: ${d3.format(",")(d3.select(this.parentNode).datum()["Lower secondary vocational education"])}`;
			break;
   		case "Upper secondary education":
			tooltipContent = `Upper secondary education:<br>` + 
					`Upper secondary general education: ${d3.format(",")(d3.select(this.parentNode).datum()["Upper secondary general education"])}<br>` + 
					`Upper secondary vocational education: ${d3.format(",")(d3.select(this.parentNode).datum()["Upper secondary vocational education"])}`;
			break;
		case "Post-secondary non-tertiary education":
			tooltipContent = `Post-secondary non-tertiary education:<br>` + 
					`Post-secondary non-tertiary general education: ${d3.format(",")(d3.select(this.parentNode).datum()["Post-secondary non-tertiary general education"])}<br>` + 
					`Post-secondary non-tertiary vocational education: ${d3.format(",")(d3.select(this.parentNode).datum()["Post-secondary non-tertiary vocational education"])}`;
			break;
		case "Tertiary education":
			tooltipContent = `Tertiary education:<br>` + 
					`Short-cycle tertiary education: ${d3.format(",")(d3.select(this.parentNode).datum()["Short-cycle tertiary education"])}<br>` + 
					`Bachelor’s or equivalent level: ${d3.format(",")(d3.select(this.parentNode).datum()["Bachelor’s or equivalent level"])}<br>`+ 
					`Master’s or equivalent level: ${d3.format(",")(d3.select(this.parentNode).datum()["Master’s or equivalent level"])}<br>`+ 
					`Doctoral or equivalent level: ${d3.format(",")(d3.select(this.parentNode).datum()["Doctoral or equivalent level"])}`;
			break;
		default:
			tooltipContent = "Default";
	}
	      
	// Show the tooltip
	tooltip.transition()
		.duration(200)
		.style("opacity", 1)
	
	// Set the customized tooltip content
	tooltip.html(tooltipContent)
		.style("left", (event.pageX + 10) + "px")
		.style("top", (event.pageY - 20) + "px");
    })
    .on("mouseout", function(event, d) {
      if (tooltip) {
	      tooltip.transition()
		      .duration(200)
		      .style("opacity", 0)
		      .remove();
	      tooltip = null; // Reset tooltip variable
      }
    });
})
