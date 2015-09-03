
$(document).ready(function(){
  load();
});

function load(){
var options = {
  country: "Mexico",
  year: 1950
}

renderGraph();


$("#year").change( function(){
  selected = $(this).find('option:selected').val();
  options.year = selected;
  renderGraph();

});

$("#country").change( function(){
  selected = $(this).find('option:selected').val();
  options.country = selected;
  renderGraph();

});




function renderGraph(){

  clearGraph();

  $.ajax({
    method: "GET",
    url: "http://api.population.io:80/1.0/population/"+ options.year +"/"+ options.country,

  }).done( function (data){
    InitChart( data );
  });

}



function InitChart( data ) {
  var barData = [];
  $.each(data, function(i, val){
    //console.log(val);
    if(i%2 == 0){
        barData.push( {'age':val.age,'total':val.total});
    }

  });




  var vis = d3.select('#visualisation'),
    WIDTH = 1200,
    HEIGHT = 500,
    MARGINS = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 100
    },
    xRange = d3.scale.ordinal().rangeRoundBands([MARGINS.left, WIDTH - MARGINS.right], 0.1).domain(barData.map(function (d) {
      return d.age;
    })),


    yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([0,
      d3.max(barData, function (d) {
        return d.total;
      })
    ]),

    xAxis = d3.svg.axis()
      .scale(xRange)
      .tickSize(3)
      .tickSubdivide(true),

    yAxis = d3.svg.axis()
      .scale(yRange)
      .tickSize(3)
      .orient("left")
      .tickSubdivide(true);


  vis.append('svg:g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
    .call(xAxis);

  vis.append('svg:g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
    .call(yAxis);

  vis.selectAll('rect')
    .data(barData)
    .enter()
    .append('rect')
    .attr('x', function (d) {
      return xRange(d.age);
    })
    .attr('y', function (d) {
      return yRange(d.total);
    })
    .attr('width', xRange.rangeBand())
    .attr('height', function (d) {
      return ((HEIGHT - MARGINS.bottom) - yRange(d.total));
    })
    .attr('fill', '#17ABBE');

}
function clearGraph(){
  var svg = d3.select("svg");
  svg.selectAll("*").remove();
}
}
