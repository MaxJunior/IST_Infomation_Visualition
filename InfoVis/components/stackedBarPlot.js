// const initScatterPlot = (data) => {
   
    const margin = {top : 30 , right: 10 , bottom: 35 , left : 80 }
	const height = 0.7 * window.innerHeight - (margin.top + margin.bottom);
    const width = 0.49 * window.innerWidth - (margin.left + margin.right);
    const colors = ["steelblue", "darkorange", "lightblue"];
    var edu_levels = ['Level1', 'Level2', 'Level3'];
    var countries,years ;     

    var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
    var stackedBars = d3.select("#svgStackedBars").append("g")
    //  .attr("transform", "translate(,-45)")
     .attr('height', height + margin.top + margin.bottom)
     .attr('width', width + margin.left + margin.right )
     .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    var y = d3.scaleLinear().rangeRound([height  - margin.bottom, margin.top]);
    var z   = d3.scaleOrdinal().domain(edu_levels).range(colors);
    var x = d3.scaleBand().range([width  ,0]).padding(.2);

    // legends : education level description + rect with colors
    var legend = stackedBars.selectAll(".legend")
    .data(colors)
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(30," + i * 14 + ")"; });
  // 
    legend.append("rect")
    .attr("x", width - 60)
    .attr("y", 40)
    .attr("width", 13)
    .attr("height", 13)
    .style("fill", function(d, i) {return colors.reverse().slice()[i];});

    legend.append("text")
    .attr("x", width - 40)
    .attr("y", 50)
    .attr("font-size", "9.5px")
    .style("text-anchor", "start")
    .style("fill", "#AAA")
    .text(function(d, i) { 
    switch (i) {
        case 0: return "Level3 : Superior Education";
        case 1: return "Level2 : High School Education";
        case 2: return "Level1 : Basic Education";
        }
    });
    var Idiom_title = stackedBars.append("text")
    .attr("x", width/2)
    .attr("y", -2)
    .attr("font-size", "18px")
    .style("text-anchor", "middle")
    .style("fill", "#AAA")
    .text("Country Income by Education Level ");

    var x_axis_legend = stackedBars.append("text")
     .attr("x", width + 15)
     .attr("y" , height - margin.bottom + 15)
     .style("fill", "#AAA")
     .text("Countries");

    var y_axis_legend = stackedBars.append("text")
      .attr("x", - width/2)
      .attr("y", -50)
      .attr("transform", "rotate(-90)")
      .style("fill", "#AAA")
      .text("Income in thousand(s) €");


// var formattedData;               
// var mydata;
d3.json("content/data/income_by_edu.json").then(
      d => chart(d)
//     //  console.log(data);
//     years =  [... new Set(data.map(d => d.Year))];
//     countries = [... new Set(data.map(d=> d.Country))];
//      mydata = data; 
//      var options = d3.select("#year").selectAll("option")
//      .data(years)
//      .enter().append("option")
//      .text(d => d);
//      // Draw legend



    // update(d3.select("#year").node().value);
    // initScatterPlot(data);
 ).catch(function(err){
     console.log(err);
 })
 





 function chart(csv) {


	var years   = [...new Set(csv.map(d => d.Year))]
	var countries = [...new Set(csv.map(d => d.countries))]

	var options = d3.select("#year").selectAll("option")
		.data(years)
	    .enter().append("option")
        .text(d => d);
         

    var xAxis = stackedBars.append("g")
        .attr("transform", "translate( 0," + (height - margin.bottom)+  ")")
        .attr("class", "x-axis");

	var yAxis = stackedBars.append("g")
		.attr("class", "y-axis");

	
		z.domain(edu_levels);

	update(d3.select("#year").property("value"), 0)

	function update(input, speed) {

		var data = csv.filter(f => f.Year == input)

		data.forEach(function(d) {
			d.total = d3.sum(edu_levels, k => +d[k])
			return d
		})

		y.domain([0, d3.max(data, d => d3.sum(edu_levels, k => +d[k]))]).nice();
        x.domain(data.map(function(d){return d.Country;}));
        
		stackedBars.selectAll(".y-axis").transition().duration(speed)
			.call(d3.axisLeft(y))

		// data.sort(d3.select("#sort").property("checked")
		// 	? (a, b) => b.total - a.total
		// 	: (a, b) => states.indexOf(a.State) - states.indexOf(b.State))

		x.domain(data.map(d => d.Country));

		stackedBars.selectAll(".x-axis").transition().duration(speed)
			.call(d3.axisBottom(x).tickSizeOuter(0))

		var group = stackedBars.selectAll("g.layer")
			.data(d3.stack().keys(edu_levels)(data), d => d.key)

		group.exit().remove()

		group.enter().append("g")
			.classed("layer", true)
			.attr("fill", d => z(d.key));

		var bars = stackedBars.selectAll("g.layer").selectAll("rect")
			.data(d => d, e => e.data.Country);

		bars.exit().remove()

		bars.enter().append("rect")
            .attr("width", x.bandwidth())
            .on("mouseover", function (d) {
                div.transition()
                  .duration(200)
                  .style("opacity", .9)
                  .text("Ola")
                  .style("left", (d3.event.pageX) + "px")
                  .style("top", (d3.event.pageY - 28) + "px");
              })
              .on("mouseout", function (d) {
                div.transition()
                  .duration(500)
                  .style("opacity", 0);
              })
			.merge(bars)
		.transition().duration(speed)
			.attr("x", d => x(d.data.Country))
			.attr("y", d => y(d[1]))
			.attr("height", d => y(d[0]) - y(d[1]));
		// var text = stackedBars.selectAll(".text")
        //     .data(data, d => d.Country)
        //     .attr("fill","#AAA");

		// text.exit().remove()

		// text.enter().append("text")
		// 	.attr("class", "text")
		// 	.attr("text-anchor", "middle")
		// 	.merge(text)
		// .transition().duration(speed)
		// 	.attr("x", d => x(d.Contry) + x.bandwidth() / 2)
		// 	.attr("y", d => y(d.total) - 5)
		// 	.text(d => d.Country);
	}

	var select = d3.select("#year")
		.on("change", function() {
			update(this.value, 750)
		})

	// var checkbox = d3.select("#sort")
	// 	.on("click", function() {
	// 		update(select.property("value"), 750)
	// 	})
}