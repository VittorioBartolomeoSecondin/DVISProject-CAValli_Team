// Define the number of Sankey diagrams
var numSankeys = 3;
var sankeyDatasets = ["data/story2/sankey/sankey_EU.csv", "data/story2/sankey/sankey_ITA.csv", "data/story2/sankey/sankey_TUR.csv"];

// Create SVG elements for each Sankey diagram
function createSankeys() {
   // Set up the SVG dimensions
   var margin = {
         top: 30,
         right: 90,
         bottom: 60,
         left: 90
      },
      width = 665 - margin.left - margin.right,
      height = 275 - margin.top - margin.bottom;

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

         // Load the data
         d3.csv(sankeyDatasets[i - 1]).then(function (data) {

            // Set the Sankey diagram properties
            var sankey = d3.sankey()
               .nodeWidth(36)
               .nodePadding(80)
               .size([width, height]);

            var path = sankey.links();

            // Set up empty graph
            sankeydata = {
               "nodes": [],
               "links": []
            };

            data.forEach(function (d) {
               sankeydata.nodes.push({
                  "name": d.source
               });
               sankeydata.nodes.push({
                  "name": d.target
               });
               sankeydata.links.push({
                  "source": d.source,
                  "target": d.target,
                  "value": +d.value
               });
            });

            // Return only the distinct / unique nodes
            sankeydata.nodes = Array.from(
               d3.group(sankeydata.nodes, d => d.name),
               ([value]) => (value)
            );

            // Loop through each link replacing the text with its index from node
            sankeydata.links.forEach(function (d, i) {
               sankeydata.links[i].source = sankeydata.nodes
                  .indexOf(sankeydata.links[i].source);
               sankeydata.links[i].target = sankeydata.nodes
                  .indexOf(sankeydata.links[i].target);
            });

            // Now loop through each node to make nodes an array of objects rather than an array of strings
            sankeydata.nodes.forEach(function (d, i) {
               sankeydata.nodes[i] = {
                  "name": d
               };
            });

            graph = sankey(sankeydata);

            // Add in the links
            var link = svg.append("g").selectAll(".link")
               .data(graph.links)
               .enter().append("path")
               .attr("id", function (d) {
                  return d.source.name + "->" + d.target.name;
               })
               .attr("class", "link")
               .attr("d", d3.sankeyLinkHorizontal())
               .attr("stroke-width", function (d) {
                  return d.width;
               });

            // Add in the nodes
            var node = svg.append("g").selectAll(".node")
               .data(graph.nodes)
               .enter().append("g")
               .attr("class", "node");


            // Add the rectangles for the nodes
            var rect = node.append("rect")
               .attr("class", "rect")
               .attr("x", function (d) {
                  return d.x0;
               })
               .attr("y", function (d) {
                  return d.y0;
               })
               .style("fill", function (d) {
                  return d.name === "Not searching for work (NEETs)" || d.name === "Searching for work (NEETs)" ? "red" : "black";
               })
               .style("stroke-width", 2)
               .attr("height", function (d) {
                  return (d.y1 - d.y0);
               })
               .attr("width", sankey.nodeWidth());

            // Add in the text for the nodes
            node.append("text")
               .attr("x", function (d) {
                  return (d.x0 + d.x1) / 2;
               })
               .attr("y", function (d) {
                  return (d.y1 + d.y0) / 2 + (d.y1 - d.y0) / 2 + 12;
               })
               .attr("dy", "0.35em")
               .attr("text-anchor", "middle")
               .text(function (d) {
                  return d.name;
               })
               .style("fill", function (d) {
                  return d.name === "Not searching for work (NEETs)" || d.name === "Searching for work (NEETs)" ? "red" : "black";
               })
               .filter(function (d) {
                  return d.x0 >= width / 2;
               })
               .attr("x", function (d) {
                  return d.name === "Not searching for work (NEETs)" ? (d.x0 + d.x1) / 2 - 35 : (d.x0 + d.x1) / 2 - 25;
               });

            rect.on("mouseover", MouseOver)
               .on("mousemove", function (event, d) {
                  // Move the tooltip with the mouse pointer
                  tooltip.style("left", (event.pageX + 10) + "px")
                     .style("top", (event.pageY + 10) + "px");
               })
               .on("mouseout", MouseOut);

            // Add hover effects to links
            link.on("mouseover", MouseOver)
               .on("mousemove", function (event, d) {
                  // Move the tooltip with the mouse pointer
                  tooltip.style("left", (event.pageX + 10) + "px")
                     .style("top", (event.pageY + 10) + "px");
               })
               .on("mouseout", MouseOut);
         });
      })(containerId);
   }
}

function MouseOver(event, d) {
   if (event.target.classList.contains("link"))
      d3.select(this).style("stroke-opacity", 0.5);
   else if (event.target.classList.contains("rect"))
      event.target.nextSibling.style.fontWeight = "bold";

   if (!tooltip) {
      tooltip = d3.select("body").append("div")
         .attr("id", "sankey_tooltip")
         .attr("class", "tooltip")
         .style("opacity", 0);
   }

   // Show the tooltip
   tooltip.transition()
      .duration(200)
      .style("opacity", 1);

   if (event.target.classList.contains("link"))
      tooltip.html(`<b>${d.source.name} → ${d.target.name}</b>: ${d.value}% of the reference population`)
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 20) + "px");
   else if (event.target.classList.contains("rect"))
      tooltip.html(`<b>${d.name}</b>: ${d.value}% of the reference population`)
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 20) + "px");
}

function MouseOut(event) {
   if (event.target.classList.contains("link"))
      d3.select(this).style("stroke-opacity", 0.2);
   else if (event.target.classList.contains("rect"))
      event.target.nextSibling.style.fontWeight = "normal";

   if (tooltip) {
      tooltip.transition()
         .duration(500)
         .style("opacity", 0)
         .remove();
      tooltip = null; // Reset tooltip variable
   }
}

createSankeys();
