// Set up the SVG dimensions
var margin = { top: 30, right: 70, bottom: 90, left: 100 },
		width = 750 - margin.left - margin.right,
		height = 650 - margin.top - margin.bottom;  
  
// append the svg object to the body of the page
var svg = d3.select("#sankey")
	  .append("svg")
	    .attr("id", "sankey_svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", 
	          "translate(" + margin.left + "," + margin.top + ")");

// Set the sankey diagram properties
var sankey = d3.sankey()
    .nodeWidth(36)
    .nodePadding(40)
    .size([width, height]);

var path = sankey.links();

// load the data
d3.csv("data/story2/sankey/sankey_EU.csv").then(function(data) {

  //set up graph in same style as original example but empty
  sankeydata = {"nodes" : [], "links" : []};

  data.forEach(function (d) {
    sankeydata.nodes.push({ "name": d.source });
    sankeydata.nodes.push({ "name": d.target });
    sankeydata.links.push({ "source": d.source,
                       "target": d.target,
                       "value": +d.value });
   });

  // return only the distinct / unique nodes
  sankeydata.nodes = Array.from(
    d3.group(sankeydata.nodes, d => d.name),
	([value]) => (value)
  );

  // loop through each link replacing the text with its index from node
  sankeydata.links.forEach(function (d, i) {
    sankeydata.links[i].source = sankeydata.nodes
      .indexOf(sankeydata.links[i].source);
    sankeydata.links[i].target = sankeydata.nodes
      .indexOf(sankeydata.links[i].target);
  });

  // now loop through each nodes to make nodes an array of objects
  // rather than an array of strings
  sankeydata.nodes.forEach(function (d, i) {
    sankeydata.nodes[i] = { "name": d };
  });

  graph = sankey(sankeydata);
	
  // add in the links
  var link = svg.append("g").selectAll(".link")
      .data(graph.links)
    .enter().append("path")
      .attr("id", function(d) {return d.source.name + "->" + d.target.name;})
      .attr("class", "link")
      .attr("d", d3.sankeyLinkHorizontal())
      .attr("stroke-width", function(d) {
         return d.width;
      });

  // add the link titles
  link.append("title")
        .text(function(d) {
    		    return d.source.name + " → " + 
                d.target.name + "\n" + d.value + "%"; });

  // add in the nodes
  var node = svg.append("g").selectAll(".node")
      .data(graph.nodes)
    .enter().append("g")
      .attr("class", "node");


  // add the rectangles for the nodes
  node.append("rect")
      .attr("x", function(d) { return d.x0; })
      .attr("y", function(d) { return d.y0; })
      .style("fill", function(d) { return d.name === "Do not want to work (not searching)" ? "red" : "black"; })
      //.style("stroke", function(d) { return d.name === "Do not want to work (not searching)" ? "red" : "black"; })
      .style("stroke-width", 2)
      .attr("height", function(d) { return d.y1 - d.y0; })
      .attr("width", sankey.nodeWidth());


  // add the title for the nodes
  node.append("title")
      .text(function(d) { 
          return d.name + "\n" + d.value + "%"; });

  // add in the text for the nodes
  node.append("text")
      .attr("x", function(d) { return d.x0 - 6; })
      .attr("y", function(d) { return (d.y1 + d.y0) / 2; })
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .text(function(d) { return d.name; })
      .style("fill", function(d) { return d.name === "Do not want to work (not searching)" ? "red" : "black"; })
    .filter(function(d) { return d.x0 < width / 2; })
      .attr("x", function(d) { return d.x1 + 6; })
      .attr("text-anchor", "start");

  node.on("mouseover", function (event, d) {
    // Highlight the current node
    d3.select(this).attr("font-weight", "bold");
  })
  .on("mouseout", function () {
    // Reset styles on mouseout
    d3.select(this).attr("font-weight", "normal");
   });

  
   // Add hover effects to links
   link.on("mouseover", function () {
	d3.select(this)
	.style("stroke-opacity", 0.5)
	.attr("stroke-width", function (d) { return Math.max(4, d.width); });
   })
	.on("mouseout", function () {
	   d3.select(this)
	     .style("stroke-opacity", 0.2)
	     .attr("stroke-width", function (d) { return d.width; });
	});
});
