




// ===========================//
// COLOR SCALES
// ===========================//

// Sex
var colorSex = d3.scaleOrdinal()
  .domain(["Male", "Female"])
  .range(["blue", "red"])

// Sporadic / Familial
var colorSporadic = d3.scaleOrdinal()
  .domain(["Sporadic", "Familial", ""])
  .range(["orange", "purple", "grey"])

// Side of Onset
var colorSideOfOnset = d3.scaleOrdinal()
  .domain(["Right", "Left", "Both"])
  .range(["yellow", "green", "red"])

// Type/Diagnosis
var colorSideOfOnset = d3.scaleOrdinal()
  .domain(["Classic", "Lower", "Upper", "Bulbar", "Flail_Arms", "Flail_Legs" "Unclassified"])
  .range(["yellow", "green", "red"])




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
    .attr("class", function(d){
      gender=d.Gender;
      sporadic=d["Sporadic...Familial"];
      diagnosis=d["ALS.DIagnosis"];
      return "mapMarker" + " " + gender + " " + sporadic + " " + diagnosis
    })
    .attr("cx", function(d){ return map.latLngToLayerPoint([d.lat, d.lon]).x })
    .attr("cy", function(d){ return map.latLngToLayerPoint([d.lat, d.lon]).y })
    .attr("r", 3)
    .style("fill", "black")
    .attr("stroke", "black")
    .attr("stroke-width", 3)
    .attr("fill-opacity", .4)

// Function that update circle position if the map zoom/position changes
function update() {
  d3.selectAll(".mapMarker")
    .attr("cx", function(d){ return map.latLngToLayerPoint([d.lat, d.lon]).x })
    .attr("cy", function(d){ return map.latLngToLayerPoint([d.lat, d.lon]).y })
}
// If the user change the map (zoom or drag), I update circle position:
map.on("moveend", update)






// ===========================//
// INITIALIZE LEGEND
// ===========================//


// LEGEND SPORADIC VS FAMILIAR
var legendSPO = L.control({position: 'bottomright'});
legendSPO.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend legendSPO')
    div.innerHTML='<i style="background:' + colorSporadic("Sporadic") + '"></i>Sporadic<br><br><i style="background:' + colorSporadic("Familial") + '"></i> Familial<br><br><i style="background:' + colorSporadic("") + '"></i>Unknown'
    return div;
};
legendSPO.addTo(map);






// Initialize the legend
var legend2 = L.control({position: 'bottomright'});

// Create the content
legend2.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend')
    div.innerHTML='<i style="background:' + "blue" + '"></i> yvfdsvdsvoo<br><br><i style="background:' + "red" + '"></i>vfdsvooo again<br>'
    return div;
};

// Print it
legend2.addTo(map);



// ===========================//
// MODIFY CIRCLES
// ===========================//

function updateChart(){

  // What kind of map is selected?
  var mapType = this.value

  // Update maps depending on choice
  if(mapType=="sporadicFamiliar"){
    d3.selectAll(".mapMarker")
      .transition().duration(1000)
      .style("fill", function(d){ return colorSporadic(d["Sporadic...Familial"]) })
      .style("stroke", function(d){ return colorSporadic(d["Sporadic...Familial"]) })
      .attr("r", 13)
  }
  if(mapType=="mndtypes"){
    d3.selectAll(".mapMarker")
      .transition().duration(1000)
      .style("fill", function(d){ return colorSex(d.Gender)})
      .style("stroke", function(d){ return colorSex(d.Gender)})
      .attr("r", 13)
  }
  if(mapType=="diagnosis"){colorScale = colorSex}
  if(mapType=="currentstate"){colorScale = colorSex}

  // Now update circles

}

// When the user click the map type button, trigger the updateChart function
$("#buttonMapType input").change(updateChart)
