function run_scatter_build() {
  // globals:

  var margin = {top: 36, right: 20, bottom: 100, left: 100},
      width = 700 - margin.left - margin.right,
      height = 620 - margin.top - margin.bottom;

    // function to transform a domain of date objects into a range of screen coordinates
  var x = d3.scale.linear()
      .range([0, width]);

      // function to transform a domain of numeric values into a range of screen coordinates
  var y = d3.scale.linear()
      .range([height, 0]);

    // function that thakes an input and transforms it into a specified range.
  var size_scale = d3.scale.linear()
      .range([3,31])

    // function that returns one of 10 colors depending on the integer input
  var color = d3.scale.category10();

    // d3.svg.axis is a predefined and you can change the options
  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

    // d3.svg.axis is a predefined and you can change the options
  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");
    
    // adds an svg element to the DOM 
  var svg = d3.select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g") // the 'g' element is just a container; also note: the indent is intentional
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); // repositions the svg to the right 'margin.left' units and down 'margin.top' units


  // MAIN 
  //  scatter plot builder 
  //  note: build_graph() takes one argument: the dataset 
  function build_graph(tweetData){
    
    // print statment often used to test code
    console.log("building scatterplot.")
    
    // format strings to date objects and make counts numeric
    tweetData.forEach(function(d) {
        //d.timeStamp = parseDate(d.timeStamp);
        d.timeStamp = new Date(d.timeStamp);
        d.followersCount = +d.followersCount;
        d.followingCount = +d.followingCount;
        d.listedCount = +d.listedCount;
        d.statusesCount = +d.statusesCount;
    });
    
    console.log("tweetData:",tweetData)
    
    // we get the min/max values from our dataset to define the domain of various functions
    size_scale.domain(d3.extent(tweetData,function(d) {return d.followersCount}));
    
    console.log(d3.extent(tweetData, function(d) { return d.followersCount; }));
    console.log(d3.extent(tweetData, function(d) { return d.followingCount; }));
    
    x.domain(d3.extent(tweetData, function(d) { return d.followingCount; }));
    y.domain(d3.extent(tweetData, function(d) { return d.followersCount; }));

    // adds the x axis
    svg.append("g")
        .attr("class", "x axis") // look at the .axis setings in style.css
        .attr("transform", "translate(0," + height +  ")")
        .call(xAxis) // calls the function that we created to use d3.svg.axis
      .append("text")
        .text("Following")
        .style("font-size",30)
        .attr("x",width)
        .attr("dy", "-.5em")
        .style("stroke","white")
        .style("text-anchor", "end");
    
    // changes the x axis css that does not include the "Following" label
    d3.selectAll(".x.axis .tick text")
        .style("text-anchor", "end")
        .attr("dx", "-0.497664em")
        .attr("dy", ".1em")
      .attr("transform", function(d) {
                  return "rotate(-65)" 
                  });
   
    // adds the y axis and some added css
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end") // additional css (http://mzl.la/1rC7zya)
        .text("Followers")
        .style("font-size",30)
        .style("stroke","white"); // we can override the css here

    // joins the data, creates the circles, classes the circles as 'dot'
    svg.selectAll(".dot")
        .data(tweetData)
      .enter().append("circle") // data binding (http://bost.ocks.org/mike/join/)
        .classed("initialCircle",true)
        .attr("r", 10)
        .attr("opacity",0.5)
        .attr("fill","red")
        .attr("cx", function(d) { return x(d.followingCount); })
        .attr("cy", function(d) { return y(d.followersCount); });

    console.log("built scatterplot")
  }

  console.log("loading data")

  d3.csv("data/sample1000_withHeader_zerosEdited.csv", function(error, rawData) {
    console.log("loaded data")
    build_graph(rawData);
  });
};

Reveal.addEventListener('scatterInitial', function(event) {
   if (!d3.select("#scatterInitial").classed("finished")){
      run_scatter_build();
      d3.select("#scatterInitial")
        .classed("finished",true)
   };
});
