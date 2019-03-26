




// ===========================//
// COLOR SCALES
// ===========================//

// Sex
var colorSex = d3.scaleOrdinal()
  .domain(["Male", "Female"])
  .range(["blue", "red"])

// family history = Sporadic or Familial
var colorFamilyHistory = d3.scaleOrdinal()
  .domain(["Sporadic", "Familial", ""])
  .range(["orange", "purple", "grey"])

// Type of diagnosis
var colorType = d3.scaleOrdinal()
  .domain(["Classic", "Lower", "Upper", "Bulbar","Unclassified","Other"])
  .range(["yellow", "green", "red", "pink", "green", "grey"])

// Side of Onset
var colorSide = d3.scaleOrdinal()
  .domain(["Right", "Left", "Both", "Unknown"])
  .range(["yellow", "green", "red", "grey"])





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
data = marker
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
      familyHistory=d.familyHistory;
      type=d.type;
      side=d.side
      return "mapMarker" + " " + gender + " " + familyHistory + " " + type + " " + side
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


// LEGEND Family History
var legendFamilyHistory = L.control({position: 'bottomright'});
legendFamilyHistory.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend legendFamilyHistory')
    div.innerHTML='<i class="controlSporadic" style="background:' + colorFamilyHistory("Sporadic") + '"></i>Sporadic<br><br><i style="background:' + colorFamilyHistory("Familial") + '"></i> Familial<br><br><i style="background:' + colorFamilyHistory("") + '"></i>Unknown'
    return div;
};
legendFamilyHistory.addTo(map);


// LEGEND Type
var legendType = L.control({position: 'bottomright'});
legendType.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend legendType')
    div.innerHTML='<i style="background:' + colorType("Classic") + '"></i>Classic<br><br><i style="background:' + colorType("Lower") + '"></i> Lower<br><br><i style="background:' + colorType("Upper") + '"></i>Upper<br><br><i style="background:' + colorType("Bulbar") + '"></i>Bulbar<br><br><i style="background:' + colorType("Unclassified") + '"></i>Unclassified<br><br><i style="background:' + colorType("Other") + '"></i>Other'
    return div;
};
legendType.addTo(map);


// LEGEND Side
var legendSide = L.control({position: 'bottomright'});
legendSide.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend legendSide')
    div.innerHTML='<i style="background:' + colorSide("Right") + '"></i>Right<br><br><i style="background:' + colorSide("Left") + '"></i> Left<br><br><i style="background:' + colorSide("Both") + '"></i>Both<br><br><i style="background:' + colorSide("Unknown") + '"></i>Unknown'
    return div;
};
legendSide.addTo(map);


// hide all Legends at the beginnings
d3.selectAll(".legend").style("display", "none")




// ===========================//
// MODIFY CIRCLES
// ===========================//

function updateChart(){

  // What kind of map is selected?
  var mapType = this.value

  // hide all Legends at the beginnings
  d3.selectAll(".legend").style("display", "none")

  // Update maps depending on choice
  if(mapType=="familyHistory"){
    d3.selectAll(".mapMarker")
      .transition().duration(1000)
      .style("fill", function(d){ return colorFamilyHistory(d.familyHistory) })
      .style("stroke", function(d){ return colorFamilyHistory(d.familyHistory) })
      .attr("r", 13)
    d3.select(".legendFamilyHistory").style("display", "block")
  }
  if(mapType=="mndtype"){
    d3.selectAll(".mapMarker")
      .transition().duration(1000)
      .style("fill", function(d){ return colorType(d.type)})
      .style("stroke", function(d){ return colorType(d.type)})
      .attr("r", 13)
    d3.select(".legendType").style("display", "block")
  }
  if(mapType=="side"){
    d3.selectAll(".mapMarker")
      .transition().duration(1000)
      .style("fill", function(d){ return colorSide(d.side)})
      .style("stroke", function(d){ return colorSide(d.side)})
      .attr("r", 13)
    d3.select(".legendSide").style("display", "block")
  }
  if(mapType=="currentstate"){colorScale = colorSex}

  // Now update circles

}

// When the user click the map type button, trigger the updateChart function
$("#buttonMapType input").change(updateChart)






// ===========================//
// INTERACTIVE LEGEND
// ===========================//

d3.select(".controlSporadic").on("click", function(){
  current = d3.selectAll(".Sporadic").attr("r")
  console.log(current)
  d3.selectAll(".Sporadic").transition().duration(1000).attr("r",current == 13 ? 0:13)

    // .transition()
    // .duration(1000)
    // .attr("r",0)
})
