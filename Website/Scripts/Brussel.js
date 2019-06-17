$(document).ready(function(){
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
			fillcolor: '#FFFAFA',
			opacity: 1,
			weight: 0.5
		}
	});
	var map = L.map('map', {
		center: [50.8505,4.3488],
		zoom: 11,
		reset: false, // important to change my map size in div along relative position
		layers: [Basemap]
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
	var baseMaps = {
		"Grayscale": Basemap
	};
	var Boundary = {
		"Boundary": boundary
	}
	//Heatmap layer
	
	var cfg = {
		  "radius": 0.005,
		  "maxOpacity": .8, 
		  "scaleRadius": true, 
		  "useLocalExtrema": true,
		  latField: 'lat',
		  lngField: 'lng',
		  valueField: 'polarity'
	};
	var positive_heatmapLayer =L.geoJSON(Brussel,{
		style: {
			color: "#000",
			fillcolor: '#FFFAFA'
		}
	});
	var negative_heatmapLayer = L.geoJSON(Brussel,{
		style: {
			color: "#000",
			fillcolor: '#FFFAFA'
		}
	});
	var Heatmap = {
			"Positive-Heatmap":  positive_heatmapLayer,
			//"Negative-Heamap":  negative_heatmapLayer
			//"Map-algera"
		};
	var MapControl = L.control.layers(baseMaps,Heatmap).addTo(map);
	Data_Selection = function( {label, value}) {
		var Heatmap_data = {
			max: 5,
			data: []
		};
		for (var i=0;i<Brussel_time.length;i++)
		{
			var point_polarity = Number(Brussel_time[i].features.properties.polarity);
			var time = Brussel_time[i].features.properties.month;
			if (point_polarity>0 && time == value){
				var point_lat = Brussel_time[i].features.geometry.coordinates[0];
				var point_lng = Brussel_time[i].features.geometry.coordinates[1];
				var point_need = {
					lat : point_lng,
					lng : point_lat,
					polarity : point_polarity
				};
				Heatmap_data.data.push(point_need);
			}	
		}
		MapControl.removeLayer(positive_heatmapLayer);
		map.removeLayer(positive_heatmapLayer);
		positive_heatmapLayer = new HeatmapOverlay(cfg);
		positive_heatmapLayer.setData(Heatmap_data);
		MapControl.addOverlay(positive_heatmapLayer,"Positive-Heatmap");
		map.addLayer(positive_heatmapLayer);
	};
	var TimeSlider = L.control.timelineSlider({
            timelineItems: ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
            labelWidth: "30px",
			betweenLabelAndRangeSpace:"15px",
			labelFontSize: "15px",
			backgroundOpacity: 0,
			position:"bottomleft",
			changeMap: Data_Selection 
		}).addTo(map);
})
	