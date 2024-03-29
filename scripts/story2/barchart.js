function updateBarChart(selectedYear, selectedCountry) {

   // Set up the SVG dimensions
   var margin = {
         top: 30,
         right: 70,
         bottom: 120,
         left: 30
      },
      width = 800 - margin.left - margin.right,
      height = 650 - margin.top - margin.bottom;

   // Append the svg object to the div of the chart
   const svg = d3.select("#barchart")
      .append("svg")
      .attr("id", "barchart_svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

   // Parse the Data
   d3.csv(selectedCountry).then(function (data) {

      // Filter out data points for the relevant year
      data = data.filter(d => d.year == selectedYear);

      // Extract unique categories for the x-axis
      const categories = [...new Set(data.map(d => d.category))];
      const indicators = [...new Set(data.map(d => d.indicator))];

      // X axis
      const x = d3.scaleBand()
         .range([0, width])
         .domain(categories)
         .padding(0.5);

      const xAxis = svg.append("g")
         .attr("class", "axis")
         .attr("transform", `translate(0, ${height})`)
         .call(d3.axisBottom(x));

      xAxis.selectAll("text")
         .attr("fill", "black")
         .style("font-size", "9px");

      // Remove ticks for each label
      xAxis.selectAll(".tick line").remove();

      // Dynamically set the domain of the y axis
      const y_domain = Math.max(70, (d3.max(data, d => +d.value)));

      // Add Y axis
      const y = d3.scaleLinear()
         .domain([0, y_domain === 70 ? 70 : y_domain + 10])
         .range([height, 0]);

      svg.append("g")
         .attr("class", "axis")
         .call(d3.axisLeft(y).tickFormat((d) => (d === 0 ? d : d + "%")))
         .selectAll("text")
         .attr("fill", "black");
                        
      // Add Y axis label
      svg.append("text")
         .attr("class", "axis-label")
         .attr("x", 5)
         .attr("y", -margin.left + 20)
         .style("text-anchor", "middle")
         .style("fill", "black")
	      .style("font-size", 10)
         .text("AROPE people");

      // Select lines of X,Y axes
      svg.selectAll(".axis")
         .selectAll("line")
         .attr("stroke", "black");

      svg.selectAll("line.grid-line")
         .data(y.ticks())
         .enter()
         .append("line")
         .attr("class", "grid-line")
         .attr("x1", 0)
         .attr("x2", width)
         .attr("y1", d => y(d))
         .attr("y2", d => y(d))
         .attr("stroke", "rgba(0, 0, 0, 0.1)");

      // Create separate groups for each indicator
      const indicatorGroups = svg.selectAll(".indicator-group")
         .data(indicators)
         .enter()
         .append("g")
         .attr("class", d => `indicator-group ${d}`);

      // Bars
      indicatorGroups.selectAll("rect")
         .data(indicator => data.filter(d => d.indicator === indicator))
         .enter()
         .append("rect")
         .attr("x", d => x(d.category))
         .attr("y", d => y(0))
         .attr("stroke", "black")
         .attr("stroke-width", 1)
         .attr("fill", d => (d.indicator === "Sex") ? "LightSalmon" : (d.indicator === "Age range") ? "LightCoral" : (d.indicator === "Education") ? "IndianRed" : "Tomato")
         .attr("width", x.bandwidth())
         .attr("height", 0)
         .transition()
         .duration(2000)
         .attr("y", d => y(d.value)) // Start from the initial height
         .attr("height", d => y(0) - y(d.value)) // Transition to the actual height
         .delay((d, i) => i * 100); // Add delay for staggered animation

      const linesData_long = [{
            startX: x(categories[1]) + x.bandwidth() * 1.5,
            endX: x(categories[1]) + x.bandwidth() * 1.5
         },
         {
            startX: x(categories[6]) + x.bandwidth() * 1.5,
            endX: x(categories[6]) + x.bandwidth() * 1.5
         },
         {
            startX: x(categories[9]) + x.bandwidth() * 1.5,
            endX: x(categories[9]) + x.bandwidth() * 1.5
         },
         {
            startX: width,
            endX: width
         },
      ];
      const linesData_short = [{
         startX: 0,
         endX: 0
      }, ];

      svg.append("g").selectAll("line")
         .data(linesData_long)
         .enter()
         .append("line")
         .attr("x1", d => d.startX)
         .attr("x2", d => d.endX)
         .attr("y1", -10)
         .attr("y2", height + 100)
         .attr("stroke", "grey");

      svg.append("g").selectAll("line")
         .data(linesData_short)
         .enter()
         .append("line")
         .attr("x1", d => d.startX)
         .attr("x2", d => d.endX)
         .attr("y1", height)
         .attr("y2", height + 100)
         .attr("stroke", "grey");

      // Text label for indicators
      svg.append("text")
         .attr("x", x(categories[0]) + x.bandwidth() * 1.3)
         .attr("y", height + 85)
         .style("font-size", "12px")
         .style("text-anchor", "middle")
         .style("font-weight", "bold")
         .text("Sex");

      svg.append("text")
         .attr("x", x(categories[4]) + x.bandwidth() / 2)
         .attr("y", height + 85)
         .style("font-size", "12px")
         .style("text-anchor", "middle")
         .style("font-weight", "bold")
         .text("Age range");

      svg.append("text")
         .attr("x", x(categories[8]) + x.bandwidth() / 2)
         .attr("y", height + 85)
         .style("font-size", "12px")
         .style("text-anchor", "middle")
         .style("font-weight", "bold")
         .text("Education");

      svg.append("text")
         .attr("x", x(categories[11]) + x.bandwidth() * 1.5)
         .attr("y", height + 85)
         .style("font-size", "12px")
         .style("text-anchor", "middle")
         .style("font-weight", "bold")
         .text("Activity status");
   })
}

let selectedYear = 2009;
let selectedCountry = "data/story2/barcharts/barchart_AUT.csv";
updateBarChart(selectedYear, selectedCountry);

// Attach an event listener to the year dropdown
document.getElementById("year-dropdown-barchart").addEventListener("change", function () {

   selectedYear = this.value;

   d3.select("#barchart_svg").remove();

   updateBarChart(selectedYear, selectedCountry);
});

// Attach an event listener to the country dropdown
document.getElementById("country-dropdown-barchart").addEventListener("change", function () {

   selectedCountry = "data/story2/barcharts/barchart_" + this.value + ".csv";

   d3.select("#barchart_svg").remove();

   updateBarChart(selectedYear, selectedCountry);
});

document.addEventListener("DOMContentLoaded", function () {
    // Define mapping of countries to disabled years
    const disabledYearsByCountry = {
        "MNE": [2009, 2010, 2011, 2012],
        "HRV": [2009],
        "ISL": [2019, 2020],
        "MKD": [2009, 2010, 2011],
        "SRB": [2009, 2010, 2011, 2012],
    };
   
    const yearDropdown = document.getElementById("year-dropdown-barchart");
    const countryDropdown = document.getElementById("country-dropdown-barchart");
   
    // Disable specific countries based on the default selected year
    const defaultSelectedYear = parseInt(yearDropdown.value);
    for (const country in disabledYearsByCountry) {
        if (disabledYearsByCountry[country].includes(defaultSelectedYear)) {
            const option = countryDropdown.querySelector(`[value='${country}']`);
            if (option) {
                option.disabled = true;
            }
        }
    }
   
    // Attach event listener to the year dropdown
    document.getElementById("year-dropdown-barchart").addEventListener("change", function () {
        const selectedYear = parseInt(this.value);
   
        // Enable all countries
        for (let i = 0; i < countryDropdown.options.length; i++) {
            countryDropdown.options[i].disabled = false;
        }
   
        // Disable specific countries based on the selected year
        for (const country in disabledYearsByCountry) {
            if (disabledYearsByCountry[country].includes(selectedYear)) {
                const option = countryDropdown.querySelector(`[value='${country}']`);
                if (option) {
                    option.disabled = true;
                }
            }
        }
    });
   
    // Attach an event listener to the country dropdown
    document.getElementById("country-dropdown-barchart").addEventListener("change", function () {
        const selectedCountry = this.value;
   
        // Enable all years
        for (let i = 0; i < yearDropdown.options.length; i++) {
            yearDropdown.options[i].disabled = false;
        }
   
        // Disable specific years based on the selected country
        if (disabledYearsByCountry[selectedCountry]) {
            disabledYearsByCountry[selectedCountry].forEach(year => {
                const option = yearDropdown.querySelector(`[value='${year}']`);
                if (option) {
                    option.disabled = true;
                }
            });
        }
    });
});
