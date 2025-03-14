var dataset;
var padding = 30;
var bar_w = 15;
d3.json("oscar_winners.json").then(function (data) {
    dataset = data;
    gen_vis();
//    console.log(dataset); 
});

function gen_vis() {
  var w = 800;
  var h = 400;
  // append an svg to the div with id 'the_chart'
  var svg = d3.select("#the_chart")
              .append("svg")
              .attr("width", w)
              .attr("height",h);

   var hscale = d3.scaleLinear()
                  .domain([0,10])
                  .range([h -padding,padding]);
    var xscale = d3.scaleLinear()
                  .domain([0,dataset.length])
                  .range([padding,w-padding]);
    
    var yaxis = d3.axisLeft().scale(hscale);
    svg.append('g').attr('transform', 'translate(30,0)')
    .attr('class', 'yaxis') // giving it a css style
    .call(yaxis);

    // add movie titles
   
    var xaxis = d3.axisBottom().scale(d3.scaleLinear()
                  .domain([dataset[0].oscar_year,dataset[dataset.length -1].oscar_year])
                  .range([padding+bar_w/2 , w-padding-bar_w/2]))
                  .tickFormat(d3.format('d'))
                  .ticks(dataset.length/4);
    svg.append('g')
       .attr('transform','translate(0,' + (h-padding) +  ')')
       .attr('class','xaxis')
       .call(xaxis);
    

    // create a rectangle
/*
    svg.append("rect")
       .attr("width",20)
       .attr("height",150)
       .attr("fill","purple")
       // svg coordinate issue
       .attr("y", h -150);  */

    svg.selectAll('rect')
       .data(dataset)
       .enter().append('rect')
       .attr('width',Math.floor((w-padding*2)/dataset.length)-1)
       .attr('height', function(d){
            return h-padding-hscale(d.rating);
       })
       .attr('fill','purple')
       .attr('x', function(d,i){
           return xscale(i);
       })
       .attr('y', function(d){
           return hscale(d.rating);
       });
    // add title
    svg.selectAll('rect').append('title')
    .data(dataset)
    .text(function(d){ return d.title;});
}
