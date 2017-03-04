var N = 5001;


var rand1 = Array(N).fill(0).map( function(v){ return (1/6)*(Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) ; } );
var rand2 = Array(N).fill(0).map( function(v){ return 0.25*(Math.random() + Math.random() + Math.random() + Math.random()) ; } );

var rand1 = generateCumSuccessRate(baserate, N);
var rand2 = generateCumSuccessRate(new_rate, N);
var graphD = {
  width:  500,
  height: 400,
  margin: 30,
  top_margin: 10,
  bottom_margin:30
}

var maxProportion = Math.max(d3.max(rand1.slice(20), function(d) {return d;}), d3.max(rand2.slice(10), function(d){return d;})   );
var minProportion = Math.min(d3.min(rand1.slice(20), function(d) {return d;}), d3.min(rand2.slice(10), function(d){return d;})   );

var prop_graph = d3.select("#proportion_graph")
                  .append("svg")
                  .attr("width", graphD.width)
                  .attr("height", graphD.height)
                  .style("background-color","yellow")
                  .on("mousemove", displayTooltip)
                  .on("mouseout", removeTooltip);

var proportion_SampleScale = d3.scaleLinear()
                  .domain([0,N])
                  .range([0 + graphD.margin, graphD.width - graphD.margin]);

var proportion_PropScale = d3.scaleLinear()
                  .domain([0,maxProportion])
                  .range([graphD.height - graphD.bottom_margin,graphD.top_margin])
                  .nice();

var proportion_SampleAxis = d3.axisBottom().scale(proportion_SampleScale)
                              .ticks(10);

var proportion_PropAxis = d3.axisLeft().scale(proportion_PropScale).ticks(10);

var sampleRate = Math.floor(proportion_SampleScale.ticks()[1]/4);
var sample1 = rand1.filter( function(value,index){ return (index % sampleRate) == 0});
var sample2 = rand2.filter( function(value,index){ return (index % sampleRate) == 0});

prop_graph.append("g")
          .attr("class","axis")
          .attr("transform", "translate(" + 0 + "," + (graphD.height - graphD.bottom_margin) + ")")
          .call(proportion_SampleAxis);

prop_graph.append("g")
          .attr("class","axis")
          .attr("transform", "translate(" + (graphD.margin) + ", 0)")
          .call(proportion_PropAxis);

var points1 = prop_graph.append("g").selectAll("circle")
                        .data(sample1)
                        .enter()
                        .append("circle")
                        .attr("fill","red")
                        .attr("r",2.5)
                        .attr("cx", function(d,i){return proportion_SampleScale(i*sampleRate);})
                        .attr("cy", function(d,i){ return proportion_PropScale(d);});

var points2 = prop_graph.append("g").selectAll("circle")
                        .data(sample2)
                        .enter()
                        .append("circle")
                        .attr("fill","blue")
                        .attr("r",2.5)
                        .attr("cx", function(d,i){return proportion_SampleScale(i*sampleRate);})
                        .attr("cy", function(d,i){ return proportion_PropScale(d);});

var line1 = d3.line().x(function (d,i) { return proportion_SampleScale(i*sampleRate);} )
                     .y(function (d)   { return proportion_PropScale(d);  } );

var crosshair = prop_graph.append('g').style('display','none');

prop_graph.append("g").append("circle").attr("fill","green").attr("r",2.5)
                      .attr("cx", proportion_SampleScale(0))
                      .attr("cy", proportion_PropScale(0.3));
crosshair.append('line').attr('id', 'focusX' ).attr('class', 'focusLine');
crosshair.append('line').attr('id', 'focusY1').attr('class', 'focusLine focusLineY1');
crosshair.append('line').attr('id', 'focusY2').attr('class', 'focusLine focusLineY2');

prop_graph.append("path").attr("class","line").attr("stroke","red")
                                              .attr("stroke-width",0.8)
                                              .attr("fill", "none")
                                              .attr("d", line1(sample1));

prop_graph.append("path").attr("class","line").attr("stroke","blue")
                                              .attr("stroke-width",0.8)
                                              .attr("fill", "none")
                                              .attr("d", line1(sample2));
//points1.attr("cx", function(d,i){return proportion_SampleScale(i);})
//                           .attr("cy", function(d,i){ return proportion_PropScale(d)  ;})


function displayTooltip(){
  var mouse = d3.mouse(this);

  /*
   * Want to "snap" to the nearest sampled points.
   * Include as a special case what happens when the cursor goes past the
   * end of the axis by picking the minimum of N and the rounded sample selection.
   */
  var sampleNum = Math.max(1, Math.min(N,Math.round(proportion_SampleScale.invert(mouse[0]) / sampleRate) * sampleRate));
  var proportions = [rand1[sampleNum-1], rand2[sampleNum-1]];
  crosshair.style('display', null);
  crosshair.select('#focusX').attr('x1', proportion_SampleScale(sampleNum)).attr('y1', proportion_PropScale(0))
                             .attr('x2', proportion_SampleScale(sampleNum)).attr('y2', proportion_PropScale(1));

  crosshair.select("#focusY1").attr('x1', proportion_SampleScale(0)).attr('y1', proportion_PropScale(proportions[0]))
                              .attr('x2', proportion_SampleScale(N)).attr('y2', proportion_PropScale(proportions[0]));

  crosshair.select("#focusY2").attr('x1', proportion_SampleScale(0)).attr('y1', proportion_PropScale(proportions[1]))
                              .attr('x2', proportion_SampleScale(N)).attr('y2', proportion_PropScale(proportions[1]));

  d3.select('#currSample').html(sampleNum);
  d3.select('#currA').html(Math.round(proportions[0]*sampleNum)  + " successes out of " + sampleNum + ": " + (100*proportions[0]).toFixed(2) + "%");
  d3.select('#currB').html(Math.round(proportions[1]*sampleNum)  + " successes out of " + sampleNum + ": " + (100*proportions[1]).toFixed(2) + "%");

  d3.select("#totalSample").html(N);
  d3.select("#totalA").html((100*rand1[rand1.length - 1]).toFixed(2) + "%");
  d3.select("#totalB").html((100*rand2[rand2.length - 1]).toFixed(2) + "%");
}

function removeTooltip(){

}
