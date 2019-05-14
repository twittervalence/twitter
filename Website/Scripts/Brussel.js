//load json data
var url = ["https://raw.githubusercontent.com/twittervalence/twitter/master/Website/JS/Brussel.json",
			"https://raw.githubusercontent.com/twittervalence/twitter/master/Website/JS/Brussel_tweet.json"]
function read_json(url){
	var json = [];
	$.ajax({
	dataType: "json",
	url: url,
	async: false,
	success: function(data){json = data}		
	});
	return json;}
Brussel = read_json(url[0])
Brussel_tweet = read_json(url[1])
//Basemap layer
var Basemap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>' ,
		id: 'mapbox.light'
	});
// Boundary layer
var boundary = L.geoJSON(Brussel,{
	style: {
		color: "#000",
		fillcolor: '#FFFAFA'
	}
});
	
//Sentiment points layer
var pointstyle_1 = {
    // Stroke properties
    color: '#5EA4D4',
    opacity: 0.75,
    weight: 2,
    // Fill properties
    fillColor: '#5EA4D4',
    fillOpacity: 0.25,
    radius: 2               
};
var pointstyle_2 = {
    // Stroke properties
    coor: '#ff0000',
    opacity: 0.75,
    weight: 2,
    // Fill properties
    fillColor: '#ff0000',
    fillOpacity: 0.25,
    radius: 2               
};
var pointstyle_3 = {
    // Stroke properties
    color: '#0000ff',
    opacity: 0.75,
    weight: 2,
    // Fill properties
    fillColor: '#0000ff',
    fillOpacity: 0.25,
    radius: 2               
};
var point = L.geoJSON(Brussel_tweet, {
	pointToLayer: function (feature, latlng) {
		if(Number(feature.properties.polarity) == 0.0) {
			return L.circleMarker(latlng, pointstyle_1);
		}
		else if(Number(feature.properties.polarity) > 0.0) {
			return L.circleMarker(latlng, pointstyle_2);
		}
		else  {
			return L.circleMarker(latlng, pointstyle_3);
		}
    }
});		
//Heatmap layer
	
var baseMaps = {
	"Grayscale": Basemap,
};
var overlayMaps = {
	"Twitter Points":point,
	"Boundary": boundary
};
	
var map = L.map('map', {
	center: [50.8505,4.3488],
	zoom: 11,
	layers: [Basemap]
});
L.control.layers(baseMaps,overlayMaps).addTo(map);

	