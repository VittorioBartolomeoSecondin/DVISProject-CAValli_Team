const width = 200,
    height = 200,
    margin = 20;

const radius = Math.min(width, height) / 2 - margin;

d3.csv("data/story2/donuts/donut2009.csv").then(function(data) {
    // Group the data by 'level'
    const groupedData = d3.group(data, d => d.level);

    for (let i = 1; i <= 7; i += 3) {
        const level = i === 1 ? 'low' : (i === 4 ? 'medium' : 'high');
        const levelData = groupedData.get(level);

        for (let j = i; j <= i + 2; j++) {
            const rank = j - i + 1;
            const countryData = levelData.find(d => +d.rank === rank);

            if (countryData) {
                const svg = d3.select("#donut_" + j)
                  .append("svg")
                    .attr("width", width)
                    .attr("height", height)
                  .append("g")
                    .attr("transform", `translate(${width/2-20},${height/2+20})`);

                const data = { M: +countryData.valueM, F: +countryData.valueF };

                const color = d3.scaleOrdinal()
                    .domain(["M", "F"])
                    .range([d3.schemeSet1[1], d3.schemeSet1[0]]);

                const pie = d3.pie()
                    .sort(null)
                    .value(d => d[1]);
                const data_ready = pie(Object.entries(data));

                const arc = d3.arc()
                    .innerRadius(radius * 0.5)
                    .outerRadius(radius * 0.8);

                svg.selectAll('allSlices')
                    .data(data_ready)
                    .join('path')
                    .attr('d', arc)
                    .attr('fill', d => color(d.data[1]))
                    .attr("stroke", "white")
                    .style("stroke-width", "2px")
                    .style("opacity", 0.7);
            }
        }
    }
});
