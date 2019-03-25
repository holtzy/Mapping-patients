




// ===========================//
// COLOR SCALES
// ===========================//

// Color scale for sex
var colorSex = d3.scaleOrdinal()
  .domain(["Male", "Female"])
  .range(["blue", "red"])

// Color scale for Sporadic / Familial
var colorSporadic = d3.scaleOrdinal()
  .domain(["Sporadic", "Familial", ""])
  .range(["orange", "purple", "grey"])





// ===========================//
// MAP BACKGROUND
// ===========================//

// mapid is the id of the div where the map will appear
var map = L
  .map('mapid')
  //.setView([-27.46, 153], 10)   // brisbane
  .setView([-26, 130], 4)   // center position + zoom
map.scrollWheelZoom.disable();

// Add a tile to the map = a background. Comes from OpenStreetmap
L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
    maxZoom: 11,
    }).addTo(map);

// Add a svg layer to the map
L.svg().addTo(map);




// ===========================//
// FLY TO SPECIFIC LOCATION
// ===========================//

// coordinates of where we have to fly to?
var coord = {australia:[-26, 130], brisbane:[-27.46, 153], melbourne:[-37.80, 144.95], perth:[-31.95, 115.85], sydney:[-33.86, 151.20], adelaide:[-34.92, 138.6]}

// Function that flies somewhere
function flyToLocation() {

  // where do we want to fly to?
  var radioValue = this.value
  var destination = coord[radioValue]

  // what is the level of zoom?
  if(radioValue=="australia"){
    zoomLevel = 4
  }else{
    zoomLevel = 10
  }

  // Let's go
  map.flyTo(destination, zoomLevel)

}

// When the user click the location button, trigger the flyto function
$("#buttonFlyLocation input").change(flyToLocation)












// ===========================//
// MAP ZOOMING OPTION
// ===========================//

//disable default scroll
map.scrollWheelZoom.disable();

$("#mapid").bind('mousewheel DOMMouseScroll', function (event) {
  event.stopPropagation();
   if (event.ctrlKey == true) {
           event.preventDefault();
       map.scrollWheelZoom.enable();
         $('#mapid').removeClass('map-scroll');
       setTimeout(function(){
           map.scrollWheelZoom.disable();
       }, 1000);
   } else {
       map.scrollWheelZoom.disable();
       $('#mapid').addClass('map-scroll');
   }

});

$(window).bind('mousewheel DOMMouseScroll', function (event) {
     $('#mapid').removeClass('map-scroll');
})








// ===========================//
// DATA
// ===========================//

// filter data ?
data = marker.filter(function(d){ return d[`Side.of.Onset`] == "LHS" })
console.log(data)







// ===========================//
// INITIALIZE CIRCLES
// ===========================//

// Select the svg area and add one circle for each patient
d3.select("#mapid")
  .select("svg")
  .selectAll("myCircles")
  .data(data)
  .enter()
  .append("circle")
    .attr("class", function(d){ return d.Gender + " " + d["Sporadic...Familial"]})
    .attr("cx", function(d){ return map.latLngToLayerPoint([d.lat, d.lon]).x })
    .attr("cy", function(d){ return map.latLngToLayerPoint([d.lat, d.lon]).y })
    .attr("r", 14)
    .style("fill", function(d){ return colorSex(d.Gender)})
    .attr("stroke", function(d){ return colorSex(d.Gender)})
    .attr("stroke-width", 3)
    .attr("fill-opacity", .4)

// Function that update circle position if the map zoom/position changes
function update() {
  d3.selectAll("circle")
    .attr("cx", function(d){ return map.latLngToLayerPoint([d.lat, d.lon]).x })
    .attr("cy", function(d){ return map.latLngToLayerPoint([d.lat, d.lon]).y })
}
// If the user change the map (zoom or drag), I update circle position:
map.on("moveend", update)







// ===========================//
// MODIFY CIRCLES
// ===========================//


// Function that update markers if filter / color buttons are changed
function updateMarkers(){

  // Show all group
  d3.selectAll("circle").transition().duration(1000).style("opacity", 1).attr("r", 14)

  // Hide groups that are unselected
  d3.selectAll(".checkbox").each(function(d){
    cb = d3.select(this);
    grp = cb.property("value")

    // If the box is check, I show the group
    if(cb.property("checked")){
    // Otherwise I hide it
    }else{
      d3.selectAll("."+grp).transition().duration(1000).style("opacity", 0).attr("r", 0)
    }
  })
}
// When a button change, I run the update function
d3.selectAll(".checkbox").on("change",updateMarkers);




// Function that update markers if filter / color buttons are changed
function updateColor(){
  // recover the option that has been chosen
  var selectedOption = d3.select(this).property("value")

  // Option 1: Sex
  if (selectedOption == "o1"){
    d3.selectAll("circle")
      .transition()
      .duration(1000)
      .style("fill", function(d){ return colorSex(d.Gender)})
      .style("stroke", function(d){ return colorSex(d.Gender)})
  }

  // Option 4: sporadic Familial
  if (selectedOption == "o4"){
    d3.selectAll("circle")
      .transition()
      .duration(1000)
      .style("fill", function(d){ return colorSporadic(d["Sporadic...Familial"])})
      .style("stroke", function(d){ return colorSporadic(d["Sporadic...Familial"])})
  }
}

// When a button change, I run the update function
d3.select("#buttonColor").on("change",updateColor);
