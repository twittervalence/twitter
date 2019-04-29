$(document).ready(function(){
	var map = L.map('map').setView([50.8505,4.3488], 11);
	
	var Basemap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
			maxZoom: 18,
			attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' ,
			id: 'mapbox.light'
		}).addTo(map);
	
	var boundary = L.geoJSON(Brussel,{
		style: {
			color: "#000",
			fillcolor: '#FFFAFA'
		}
	}).addTo(map);
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
        color: '#ff0000',
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
		
	}).addTo(map);
})
	