

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
// GEOCOORDINATES DATABASE
// ===========================//

// coordinates of where we have to fly to?
var coord = {
  australia:[-26, 130],
  brisbane:[-27.46, 153],
  queensland:[-23.7, 148],
  melbourne:[-37.80, 144.95],
  perth:[-31.95, 115.85],
  wa: [-27.67, 121.62],
  sydney:[-33.86, 151.20],
  adelaide:[-34.92, 138.6]
}
var zoom = {
  australia:4,
  perth:10,
  wa:6,
}




// ===========================//
// MAP BACKGROUND INITIALIZATION
// ===========================//

// mapid is the id of the div where the map will appear
// initstate is a variable created in the index file of each country
var map = L
  .map('mapid')
  .setView(coord[initState], zoom[initState])   // center position + zoom
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

// Function that flies somewhere
function flyToLocation() {

  // where do we want to fly to?
  var radioValue = this.value
  var destination = coord[radioValue]
  var zoomLevel = zoom[radioValue]

  // Let's go
  d3.selectAll(".mapMarker").attr("r",0)
  map.flyTo(destination, zoomLevel)
  d3.selectAll(".mapMarker").transition().delay(3000).duration(1000).attr("r",13)

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
      gender=d.gender;
      familyHistory=d.familyHistory;
      type=d.type;
      side=d.side;
      ageAtDiagnosis="age"+d.ageAtDiagnosis.replace("<","less").replace(">","more")
      return "mapMarker" + " " + gender + " " + familyHistory + " " + type + " " + side + " " + ageAtDiagnosis
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
    div.innerHTML='<b>Family History</b><hr><br><i class="controlSporadic" style="background:' + colorFamilyHistory("Sporadic") + '"></i>Sporadic<br><br><i class="controlFamilial" style="background:' + colorFamilyHistory("Familial") + '"></i> Familial<br><br><hr>Click circle to toggle'
    return div;
};
legendFamilyHistory.addTo(map);


// LEGEND Type
var legendType = L.control({position: 'bottomright'});
legendType.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend legendType')
    div.innerHTML='<b>ALS type</b><hr><br><br><i class="controlClassic" style="background:' + colorType("Classic") + '"></i>Classic<br><br><i class="controlLower" style="background:' + colorType("Lower") + '"></i> Lower<br><br><i class="controlUpper" style="background:' + colorType("Upper") + '"></i>Upper<br><br><i class="controlBulbar" style="background:' + colorType("Bulbar") + '"></i>Bulbar<br><br><i class="controlUnclassified" style="background:' + colorType("Unclassified") + '"></i>Unclassified<br><br><i class="controlOther" style="background:' + colorType("Other") + '"></i>Other<br><br><hr>Click circle to toggle'
    return div;
};
legendType.addTo(map);


// LEGEND Side
var legendSide = L.control({position: 'bottomright'});
legendSide.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend legendSide')
    div.innerHTML='<b>Symptom Side</b><hr><br><br><i class="controlRight" style="background:' + colorSide("Right") + '"></i>Right<br><br><i class="controlLeft" style="background:' + colorSide("Left") + '"></i> Left<br><br><i class="controlBoth" style="background:' + colorSide("Both") + '"></i>Both<br><br><i class="controlUnknown" style="background:' + colorSide("Unknown") + '"></i>Unknown<br><br><hr>Click circle to toggle'
    return div;
};
legendSide.addTo(map);

// LEGEND Age at diagnosis
var legendAgeAtDiagnosis = L.control({position: 'bottomright'});
legendAgeAtDiagnosis.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend legendAgeAtDiagnosis')
    div.innerHTML='<b>Age at Diagnosis</b><hr><br><br><i class="controlLess40" style="background:' + colorAgeAtDiagnosis("<40") + '"></i><40<br><br><i class="control40-50" style="background:' + colorAgeAtDiagnosis("40-50") + '"></i>40-50<br><br><i class="control50-60" style="background:' + colorAgeAtDiagnosis("50-60") + '"></i>50-60<br><br><i class="controlMore60" style="background:' + colorAgeAtDiagnosis(">60") + '"></i>>60<br><br><i class="controlAgeUnknown" style="background:' + colorAgeAtDiagnosis("Unknown") + '"></i>Unknown<br><br><hr>Click circle to toggle'
    return div;
};
legendAgeAtDiagnosis.addTo(map);


// hide all Legends at the beginnings
d3.selectAll(".legend").style("display", "none")






// ===========================//
// MODIFY CIRCLES
// ===========================//

function updateChart(){

  // What kind of sex is selected?
  var selectedSex = $('#buttonSex input:radio:checked').val()

  // What kind of map is selected?
  var mapType = $('#buttonMapType input:radio:checked').val()

  // hide all Legends at the beginning
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
  if(mapType=="ageAtDiagnosis"){
    d3.selectAll(".mapMarker")
      .transition().duration(1000)
      .style("fill", function(d){ return colorAgeAtDiagnosis(d.ageAtDiagnosis)})
      .style("stroke", function(d){ return colorAgeAtDiagnosis(d.ageAtDiagnosis)})
      .attr("r", 13)
    d3.select(".legendAgeAtDiagnosis").style("display", "block")
  }

  // Hide circle if neccessary
  if(selectedSex=="males"){
    d3.selectAll(".Male").style("opacity", 1)
    d3.selectAll(".Female").style("opacity", 0)
  }
  if(selectedSex=="females"){
    d3.selectAll(".Male").style("opacity", 0)
    d3.selectAll(".Female").style("opacity", 1)
  }
  if(selectedSex=="both"){
    d3.selectAll(".Male").style("opacity", 1)
    d3.selectAll(".Female").style("opacity", 1)
  }

}

// When the user click the map type button, trigger the updateChart function
$("#buttonSex input").change(updateChart)
$("#buttonMapType input").change(updateChart)






// ===========================//
// INTERACTIVE LEGEND
// ===========================//

// family History
d3.select(".controlSporadic").on("click", function(){
  btn = d3.select(".controlSporadic").style("opacity")
  d3.select(".controlSporadic").transition().duration(1000).style("opacity", btn==1 ? 0.3:1)
  current = d3.selectAll(".Sporadic").attr("r")
  d3.selectAll(".Sporadic").transition().duration(1000).attr("r",current == 13 ? 0:13)
})
d3.select(".controlFamilial").on("click", function(){
  btn = d3.select(".controlFamilial").style("opacity")
  d3.select(".controlFamilial").transition().duration(1000).style("opacity", btn==1 ? 0.3:1)
  current = d3.selectAll(".Familial").attr("r")
  d3.selectAll(".Familial").transition().duration(1000).attr("r",current == 13 ? 0:13)
})


// MND type
d3.select(".controlClassic").on("click", function(){
  btn = d3.select(".controlClassic").style("opacity")
  d3.select(".controlClassic").transition().duration(1000).style("opacity", btn==1 ? 0.3:1)
  current = d3.selectAll(".Classic").attr("r")
  d3.selectAll(".Classic").transition().duration(1000).attr("r",current == 13 ? 0:13)
})
d3.select(".controlLower").on("click", function(){
  btn = d3.select(".controlLower").style("opacity")
  d3.select(".controlLower").transition().duration(1000).style("opacity", btn==1 ? 0.3:1)
  current = d3.selectAll(".Lower").attr("r")
  d3.selectAll(".Lower").transition().duration(1000).attr("r",current == 13 ? 0:13)
})
d3.select(".controlUpper").on("click", function(){
  btn = d3.select(".controlUpper").style("opacity")
  d3.select(".controlUpper").transition().duration(1000).style("opacity", btn==1 ? 0.3:1)
  current = d3.selectAll(".Upper").attr("r")
  d3.selectAll(".Upper").transition().duration(1000).attr("r",current == 13 ? 0:13)
})
d3.select(".controlBulbar").on("click", function(){
  btn = d3.select(".controlBulbar").style("opacity")
  d3.select(".controlBulbar").transition().duration(1000).style("opacity", btn==1 ? 0.3:1)
  current = d3.selectAll(".Bulbar").attr("r")
  d3.selectAll(".Bulbar").transition().duration(1000).attr("r",current == 13 ? 0:13)
})
d3.select(".controlUnclassified").on("click", function(){
  btn = d3.select(".controlUnclassified").style("opacity")
  d3.select(".controlUnclassified").transition().duration(1000).style("opacity", btn==1 ? 0.3:1)
  current = d3.selectAll(".Unclassified").attr("r")
  d3.selectAll(".Unclassified").transition().duration(1000).attr("r",current == 13 ? 0:13)
})
d3.select(".controlOther").on("click", function(){
  btn = d3.select(".controlOther").style("opacity")
  d3.select(".controlOther").transition().duration(1000).style("opacity", btn==1 ? 0.3:1)
  current = d3.selectAll(".Other").attr("r")
  d3.selectAll(".Other").transition().duration(1000).attr("r",current == 13 ? 0:13)
})




// SIDE
d3.select(".controlRight").on("click", function(){
  btn = d3.select(".controlRight").style("opacity")
  d3.select(".controlRight").transition().duration(1000).style("opacity", btn==1 ? 0.3:1)
  current = d3.selectAll(".Right").attr("r")
  d3.selectAll(".Right").transition().duration(1000).attr("r",current == 13 ? 0:13)
})
d3.select(".controlLeft").on("click", function(){
  btn = d3.select(".controlLeft").style("opacity")
  d3.select(".controlLeft").transition().duration(1000).style("opacity", btn==1 ? 0.3:1)
  current = d3.selectAll(".Left").attr("r")
  d3.selectAll(".Left").transition().duration(1000).attr("r",current == 13 ? 0:13)
})
d3.select(".controlBoth").on("click", function(){
  btn = d3.select(".controlBoth").style("opacity")
  d3.select(".controlBoth").transition().duration(1000).style("opacity", btn==1 ? 0.3:1)
  current = d3.selectAll(".Both").attr("r")
  d3.selectAll(".Both").transition().duration(1000).attr("r",current == 13 ? 0:13)
})
d3.select(".controlUnknown").on("click", function(){
  btn = d3.select(".controlUnknown").style("opacity")
  d3.select(".controlUnknown").transition().duration(1000).style("opacity", btn==1 ? 0.3:1)
  current = d3.selectAll(".Unknown").attr("r")
  d3.selectAll(".Unknown").transition().duration(1000).attr("r",current == 13 ? 0:13)
})

// Age at diagnosis
d3.select(".controlLess40").on("click", function(){
  btn = d3.select(".controlLess40").style("opacity")
  d3.select(".controlLess40").transition().duration(1000).style("opacity", btn==1 ? 0.3:1)
  current = d3.selectAll(".ageless40").attr("r")
  d3.selectAll(".ageless40").transition().duration(1000).attr("r",current == 13 ? 0:13)
})
d3.select(".control40-50").on("click", function(){
  btn = d3.select(".control40-50").style("opacity")
  d3.select(".control40-50").transition().duration(1000).style("opacity", btn==1 ? 0.3:1)
  current = d3.selectAll(".age40-50").attr("r")
  d3.selectAll(".age40-50").transition().duration(1000).attr("r",current == 13 ? 0:13)
})
d3.select(".control50-60").on("click", function(){
  btn = d3.select(".control50-60").style("opacity")
  d3.select(".control50-60").transition().duration(1000).style("opacity", btn==1 ? 0.3:1)
  current = d3.selectAll(".age50-60").attr("r")
  d3.selectAll(".age50-60").transition().duration(1000).attr("r",current == 13 ? 0:13)
})
d3.select(".controlMore60").on("click", function(){
  btn = d3.select(".controlMore60").style("opacity")
  d3.select(".controlMore60").transition().duration(1000).style("opacity", btn==1 ? 0.3:1)
  current = d3.selectAll(".agemore60").attr("r")
  d3.selectAll(".agemore60").transition().duration(1000).attr("r",current == 13 ? 0:13)
})
d3.select(".controlAgeUnknown").on("click", function(){
  btn = d3.select(".controlAgeUnknown").style("opacity")
  d3.select(".controlAgeUnknown").transition().duration(1000).style("opacity", btn==1 ? 0.3:1)
  current = d3.selectAll(".ageUnknown").attr("r")
  d3.selectAll(".ageUnknown").transition().duration(1000).attr("r",current == 13 ? 0:13)
})







//
