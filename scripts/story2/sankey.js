// Define the number of Sankey diagrams
var numSankeys = 3;

var sankeyDatasets = ["data/story2/sankey/sankey_EU.csv", "data/story2/sankey/sankey_ITA.csv", "data/story2/sankey/sankey_TUR.csv"];

// Create SVG elements for each Sankey diagram
function createSankeys() {
	// Set up the SVG dimensions
	var margin = { top: 30, right: 70, bottom: 30, left: 70 },
		width = 750 - margin.left - margin.right,
		height = 750 - margin.top - margin.bottom;  
	
	for (var i = 1; i <= numSankeys; i++) {
	    	var containerId = "#sankey" + i;

		(function (containerId) {
	    	// Create the SVG element for the Sankey diagram
	    	var svg = d3.select(containerId)
	        	.append("svg")
	        	.attr("width", width + margin.left + margin.right)
	        	.attr("height", height + margin.top + margin.bottom)
	        	.append("g")
	        	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		// load the data
		d3.csv(sankeyDatasets[i - 1]).then(function(data) {
		
		  // Set the sankey diagram properties
		  var sankey = d3.sankey()
		      .nodeWidth(36)
		      .nodePadding(80)
		      .size([width, height * 0.3]);
		
		  var path = sankey.links();
		
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
		      .style("fill", function(d) { return d.name === "Not searching for work (NEETs)" || d.name === "Searching for work (NEETs)" ? "red" : "black"; })
		      .style("stroke-width", 2)
		      .attr("height", function(d) { return (d.y1 - d.y0); })
		      .attr("width", sankey.nodeWidth());
		
		
		  // add the title for the nodes
		  node.append("title")
		      .text(function(d) { 
		          return d.name + "\n" + d.value + "%"; });
		
		  // add in the text for the nodes
		  node.append("text")
		      .attr("x", function (d) { return (d.x0 + d.x1) / 2; })
		      .attr("y", function(d) { return (d.y1 + d.y0) / 2 + (d.y1 - d.y0) / 2 + 12; })
		      .attr("dy", "0.35em")
		      .attr("text-anchor", "middle")
		      .text(function(d) { return d.name; })
		      .style("fill", function(d) { return d.name === "Not searching for work (NEETs)" || d.name === "Searching for work (NEETs)" ? "red" : "black"; })
		    .filter(function(d) { return d.x0 >= width / 2; })
		      .attr("x", function (d) { return d.name === "Not searching for work (NEETs)" ? (d.x0 + d.x1) / 2 - 35 : (d.x0 + d.x1) / 2 - 25; });
		
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
			.style("stroke-opacity", 0.5);
		   })
			.on("mouseout", function () {
			   d3.select(this)
			     .style("stroke-opacity", 0.2);
			});
		});
		})(containerId);
	}
}

createSankeys();
