// ===========================//
// COLOR SCALES
// ===========================//

// Sex
var colorSex = d3.scaleOrdinal()
  .domain(["Male", "Female"])
  .range(["blue", "red"])

// family history = Sporadic or Familial
var colorFamilyHistory = d3.scaleOrdinal()
  .domain(["Sporadic", "Familial"])
  .range(["orange", "purple"])

// Type of diagnosis
var colorType = d3.scaleOrdinal()
  .domain(["Classic", "Lower", "Upper", "Bulbar","Unclassified","Other"])
  .range(["#4f6980", "#f47942", "#a2ceaa", "#638b66", "#bFbb60", "grey"])

// Side of Onset
var colorSide = d3.scaleOrdinal()
  .domain(["Right", "Left", "Both", "Unknown"])
  .range(["#b9a0b4", "#cecb76", "#ff9888", "grey"])

// Age at diagnosis
var colorAgeAtDiagnosis = d3.scaleOrdinal()
  .domain(["<40", "40-50", "50-60", ">60","Unknown"])
  .range(["#FFC300", "#FF5733", "#C70039", "#900C3F", "grey"])






// ===========================//
// SVG AREAS
// ===========================//

// set the dimensions and margins of the graph
var margin = {top: 20, right: 30, bottom: 40, left: 90},
    width = 330 - margin.left - margin.right,
    height = 230 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svgGender = d3.select("#barGender")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


// append the svg object to the body of the page
var svgType = d3.select("#barType")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");



// ===========================//
// BUILD DATA
// ===========================//

// get data
data = marker

// Gender count?
var genderCount = d3.nest()
  .key(function(d) { return d.gender; })
  .rollup(function(v) { return v.length; })
  .entries(marker);

// Type count?
var typeCount = d3.nest()
  .key(function(d) { return d.type; })
  .rollup(function(v) { return v.length; })
  .entries(marker);
console.log(typeCount)








// ===========================//
// GENDER BARPLOT
// ===========================//

  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 200])
    .range([ 0, width]);
  svgGender.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  // Y axis
  var y = d3.scaleBand()
    .range([ 0, height ])
    .domain(genderCount.map(function(d) { return d.key; }))
    .padding(.6);
  svgGender.append("g")
    .call(d3.axisLeft(y).ticks(0))

  //Bars
  svgGender.selectAll("myRect")
    .data(genderCount)
    .enter()
    .append("rect")
    .attr("x", x(0) )
    .attr("y", function(d) { return y(d.key); })
    .attr("width", function(d) { return x(d.value); })
    .attr("height", y.bandwidth() )
    .attr("fill", function(d){ return colorSex(d.key)})



// ===========================//
// TYPE BARPLOT
// ===========================//

  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 200])
    .range([ 0, width]);
  svgType.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  // Y axis
  var y = d3.scaleBand()
    .range([ 0, height ])
    .domain(typeCount.map(function(d) { return d.key; }))
    .padding(.4);
  svgType.append("g")
    .call(d3.axisLeft(y))

  //Bars
  svgType.selectAll("myRect")
    .data(typeCount)
    .enter()
    .append("rect")
    .attr("x", x(0) )
    .attr("y", function(d) { return y(d.key); })
    .attr("width", function(d) { return x(d.value); })
    .attr("height", y.bandwidth() )
    .attr("fill", function(d){ return colorType(d.key)})
