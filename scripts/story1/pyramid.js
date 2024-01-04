// set the dimensions and margins of the graph
var margin = { top: 10, right: 50, bottom: 10, left: 20 },
	           width = 950 - margin.left - margin.right,
	           height = 575 - margin.top - margin.bottom;

d3.csv("data/story1/pyramids/pyramid2009.csv").then(function(data) {
	
	// Append the svg object to the body of the page
	const svg = d3.select("#pyramid")
		.append("svg")
		.attr("viewBox", [0, 0, width, height])
		.attr("font-family", "sans-serif")
		.attr("font-size", 10)
		.attr("id", "pyramid_svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", `translate(${margin.left}, ${margin.top})`);

	var len = data.length;
		
	var xM = d3.scaleLinear()
		.domain([0, d3.max(data, d => +d.percentage)])
		.rangeRound([width / 2, margin.left]);

	var xF = d3.scaleLinear()
		.domain(xM.domain())
		.rangeRound([width / 2, width - margin.right]);
	
	var y = d3.scaleBand()
		// .domain(data.map(d => d.name))
		.domain(data.map(d => d.abbreviation))
		.rangeRound([height - margin.bottom, margin.top])
		.padding(0.1);

	var xAxis = g => g
		.attr("transform", `translate(0,${height - margin.bottom})`)
		.call(g => g.append("g")
        	.attr("transform", `translate(-50,0)`) // Translate the male axis by 10 units vertically
        	.call(d3.axisBottom(xM).ticks(5, "s")))
    		.call(g => g.append("g")
        	.attr("transform", `translate(50,0)`) // Translate the female axis by 10 units vertically
        	.call(d3.axisBottom(xF).ticks(5, "s")))
		.call(g => g.selectAll(".domain").remove())
		.call(g => g.selectAll(".tick:first-of-type").remove());
	
	var yAxis = g => g
		.attr("transform", `translate(${xM(0)},0)`)
		.call(d3.axisRight(y).tickSize(0).tickFormat(''))
		.call(g => g.selectAll(".tick text").attr("fill", "white"));

	svg.append("g")
		.selectAll("rect")
		.data(data)
		.enter()
		.append("rect")
		.attr("transform", d => d.sex === "F" ? `translate(50,0)` : `translate(-50,0)`)
		.attr("x", d => d.sex === "M" ? xM(+d.percentage) : xF(0))
		// .attr("y", d => y(d.name))
		.attr("y", d => y(d.abbreviation))
		.attr("width", d => d.sex === "M" ? xM(0) - xM(+d.percentage) : xF(+d.percentage) - xF(0))
		.attr("height", y.bandwidth())
		.attr("fill", d => d3.schemeSet1[d.sex === "M" ? 1 : 0]);
	
	svg.append("g")
		.attr("fill", "white")
		.selectAll("text")
		.data(data)
		.join("text")
		.attr("text-anchor", d => d.sex === "M" ? "start" : "end")
		.attr("x", d => d.sex === "M" ? xM(+d.percentage) - 46 : xF(+d.percentage) + 46)
		// .attr("y", d => y(d.name) + y.bandwidth() / 2)
		.attr("y", d => y(d.abbreviation) + y.bandwidth() / 2)
		.attr("dy", "0.35em")
		.text(d => d.percentage);
		// .text(d => d.percentage.toLocaleString());
	
	svg.append("text")
		.attr("transform", `translate(-50,-10)`)
		.attr("text-anchor", "end")
		.attr("fill", "black")
		.attr("dy", "0.35em")
		.attr("x", xM(0) - 4)
		// .attr("y", y(data[0].name) + y.bandwidth() / 2)
		.attr("y", y(data[len - 1].abbreviation) - y.bandwidth() / 2)
		.text("Male");
	
	svg.append("text")
		.attr("transform", `translate(50,-10)`)
		.attr("text-anchor", "start")
		.attr("fill", "black")
		.attr("dy", "0.35em")
		.attr("x", xF(0) + 4)
		// .attr("y", y(data[0].name) + y.bandwidth() / 2)
		.attr("y", y(data[len - 1].abbreviation) - y.bandwidth() / 2)
		.text("Female");

	svg.append("g")
		.call(xAxis);

	/*svg.append("g")
		.call(yAxis);*/
	
	return svg.node();
});
