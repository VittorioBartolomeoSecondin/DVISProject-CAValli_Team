// set the dimensions and margins of the graph
var margin = { top: 60, right: 70, bottom: 70, left: 100 },
	           width = 1435 - margin.left - margin.right,
	           height = 650 - margin.top - margin.bottom;

// Create a tooltip
const tooltip = d3.select("#pyramid")
                  .append("section")
                    .attr("id", "pyramid_tooltip")
                  .style("opacity", 0)
                  .style("background-color", "lightgray")
                  .style("border", "2px solid black")
                    .attr("class", "tooltip");

var svg = d3.create("svg")
		    .attr("viewBox", [0, 0, width, height])
		    .attr("font-family", "sans-serif")
		    .attr("font-size", 10);

d3.csv("/data/story1/pyramids/pyramid2009.csv).then(function(data) {
       
	xM = d3.scaleLinear()
		.domain([0, d3.max(data, d => d.percentage)])
		.rangeRound([width / 2, margin.left])
	
	xF = d3.scaleLinear()
		.domain(xM.domain())
		.rangeRound([width / 2, width - margin.right])

	y = d3.scaleBand()
		.domain(data.map(d => d.name))
		.rangeRound([height - margin.bottom, margin.top])
		.padding(0.1)

	xAxis = g => g
		.attr("transform", `translate(0,${height - margin.bottom})`)
		.call(g => g.append("g").call(d3.axisBottom(xM).ticks(width / 80, "s")))
		.call(g => g.append("g").call(d3.axisBottom(xF).ticks(width / 80, "s")))
		.call(g => g.selectAll(".domain").remove())
		.call(g => g.selectAll(".tick:first-of-type").remove())
	
	yAxis = g => g
		.attr("transform", `translate(${xM(0)},0)`)
		.call(d3.axisRight(y).tickSizeOuter(0))
		.call(g => g.selectAll(".tick text").attr("fill", "white"))
		
	chart = {
		svg.append("g")
			.selectAll("rect")
			.data(data)
			.join("rect")
			.attr("fill", d => d3.schemeSet1[d.sex === "M" ? 1 : 0])
			.attr("x", d => d.sex === "M" ? xM(d.percentage) : xF(0))
			.attr("y", d => y(d.name))
			.attr("width", d => d.sex === "M" ? xM(0) - xM(d.percentage) : xF(d.percentage) - xF(0))
			.attr("height", y.bandwidth());
		
		svg.append("g")
			.attr("fill", "white")
			.selectAll("text")
			.data(data)
			.join("text")
			.attr("text-anchor", d => d.sex === "M" ? "start" : "end")
			.attr("x", d => d.sex === "M" ? xM(d.percentage) + 4 : xF(d.percentage) - 4)
			.attr("y", d => y(d.name) + y.bandwidth() / 2)
			.attr("dy", "0.35em")
			.text(d => d.value.toLocaleString());
		
		svg.append("text")
			.attr("text-anchor", "end")
			.attr("fill", "white")
			.attr("dy", "0.35em")
			.attr("x", xM(0) - 4)
			.attr("y", y(data[0].name) + y.bandwidth() / 2)
			.text("Male");
		
		svg.append("text")
			.attr("text-anchor", "start")
			.attr("fill", "white")
			.attr("dy", "0.35em")
			.attr("x", xF(0) + 24)
			.attr("y", y(data[0].name) + y.bandwidth() / 2)
			.text("Female");

		svg.append("g")
			.call(xAxis);

		svg.append("g")
			.call(yAxis);
		
		return svg.node();
	}
});
