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
		center: [50.83946,4.35836],
		zoom: 11.5,
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

		var info = L.control();

		var geojson = L.geoJson(Brussel_dist, { style: style, onEachFeature: onEachFeature }).addTo(map);

		function onEachFeature(feature, layer) {
			layer.on({
				click: zoomFocus,
				mouseover: performHover,
				mouseout: destroyHover, 
			});
		}

		function style(feature) {
			return {
				fillColor: "#6fdf60",
				weight: 0.5,
				opacity: 0.8,
				color: "white",
				dashArray: "0",
				fillOpacity: 0.6,
			};
		}
		
		// Highlight Feature upon mouse focus
		function performHover(evt) {
			var layer = evt.target;
		
			layer.setStyle({
				weight: 2,
				color: "grey",
				dashArray: "0",
				fillOpacity: 0.7,
			});
		
			if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
				layer.bringToFront();
			}
			info.update(layer.feature.properties);
		}
		
		// zoom to feature at windows extent bounds
		function zoomFocus(e) {
			map.fitBounds(e.target.getBounds().pad(1.5));
		}
		
		function destroyHover(e) {
			geojson.resetStyle(e.target);
			info.update({
				NAME_FRE : "---",
				AREA : "---",
			});
		
		}
		
		// Update window with values
		info.update = function(properties) {
			document.getElementById("city").innerHTML = properties.NAME_FRE;
			document.getElementById("state").innerHTML = properties.AREA + ' Sq. Meter';
		};


		//Create a marker layer (in the example done via a GeoJSON FeatureCollection)
		var valencelayer = L.geoJson(Vienna_time);
		var sliderControl = L.control.sliderControl({
			position: "bottomright",
			layer: valencelayer,
			range: true
		});

		//Make sure to add the slider to the map ;-)
		map.addControl(sliderControl);

		//And initialize the slider
		sliderControl.startSlider();
})
	