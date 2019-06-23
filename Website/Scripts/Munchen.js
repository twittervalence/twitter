$(document).ready(function(){
	var Basemap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
			maxZoom: 18,
			attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ',
			id: 'mapbox.light',
		});
	
	var boundary = L.geoJSON(Munchen,{
		style: {
			color: "#000",
			fillcolor: '#FFFAFA',
			opacity: 1,
			weight: 0.5,
		}
	});
	var map = L.map('map', {
		center: [48.137154, 11.576124],
		zoom: 11,
		reset: false, // important to change my map size in div along relative position
		layers: [Basemap]
	});
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
	var point = L.geoJSON(Munich_tweet, {
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
	var positive_heatmapLayer =L.geoJSON(Munchen,{
		style: {
			color: "#000",
			fillcolor: '#FFFAFA'
		}
	});
	var negative_heatmapLayer = L.geoJSON(Munchen,{
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

	var geojson = L.geoJson(Munchen_dist, { style: style, onEachFeature: onEachFeature }).addTo(map);

	var Munich = {
		"Munich": geojson,
	}
	
	var MapControl = L.control.layers(baseMaps, Munich, Heatmap).addTo(map);
	
	Data_Selection = function( {label, value}) {
		var Heatmap_data = {
			max: 5,
			data: []
		};
		for (var i=0;i<Munich_time.length;i++)
		{
			var point_polarity = Number(Munich_time[i].features.properties.polarity);
			var time = Munich_time[i].features.properties.month;
			if (point_polarity>0 && time == value){
				var point_lat = Munich_time[i].features.geometry.coordinates[0];
				var point_lng = Munich_time[i].features.geometry.coordinates[1];
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
	
	// Timeslider control
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

		// var geojson = L.geoJson(Munchen_dist, { style: style, onEachFeature: onEachFeature }).addTo(map);

		function onEachFeature(feature, layer) {
			layer.on({
				click: zoomFocus,
				mouseover: performHover,
				mouseout: destroyHover, 
			});
		}

		function style(feature) {
			return {
				fillColor: "#73B2FF",
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
				Bezirk : "---",
				AREA : "---",
			});
		
		}
		
		// Update window with values
		info.update = function(properties) {
			document.getElementById("city").innerHTML = properties.Bezirk;
			document.getElementById("state").innerHTML = properties.AREA + ' Sq. Meter';
			document.getElementById("cloud").innerHTML = " ";

			//draw the word cloud
			var frequency_list = [{"text":"Ostritz","size":40},{"text":"FridaysForFuture","size":15},{"text":"Polizei","size":10},{"text":" EndeGelaende","size":15},{"text":"WCEU","size":10},{"text":"Kohleausstieg","size":5},{"text":"FridaysForFuture","size":10},{"text":"Kohleausstieg","size":5},{"text":"Kirchentag","size":5},{"text":"ac2106","size":85},{"text":"Grube","size":5},{"text":"Aktivisten","size":5},{"text":"Tagebau","size":15},{"text":"Viertelfinale","size":45},{"text":"BoyWithLuv21stWin","size":30},{"text":"Viertelfinale","size":5},{"text":"24hNITRO","size":5},{"text":"AlleGegenRWE","size":10},{"text":"CRUSH GAME","size":120},{"text":"formulae","size":5},{"text":" Energie","size":15},{"text":"Schönen Samstag","size":15},{"text":"Mitte der Gesellschaft","size":15},{"text":"Polizisten","size":15},{"text":"Patches","size":15},{"text":"Giffey","size":20},{"text":"giffey","size":15},{"text":"zeigteureschluesselanhaenger","size":15},{"text":"Elfmeterschießen","size":15},{"text":"WeLoveYouHoseok","size":15},{"text":"FIFAWWC","size":15},{"text":"GERNIG","size":15},{"text":"MerylStreep","size":25},{"text":"NORAUS","size":5},{"text":"zeigteureschluesselanhaenger","size":15},{"text":"Energie","size":5},{"text":"MerylStreep","size":10},{"text":"CRUSH GAME","size":5},{"text":"Elfmeterschießen","size":5},{"text":"gameHausfriedensbruch","size":5},{"text":"DEKT19","size":10},{"text":"Hockenheimring","size":10},{"text":"Hockenheimring","size":10},{"text":"Munich","size":5},{"text":"Müchen","size":10},{"text":"Allez","size":5},{"text":"Allezgut","size":5},{"text":"AlleDörferbleiben","size":5},{"text":"Finger","size":5},{"text":"weloveyouhoseok","size":5},{"text":"gernig","size":5},{"text":"Sommersonnenwende","size":5},{"text":"frenchgp","size":5},{"text":"Gelände","size":5},{"text":"Nacht des Jahres","size":5},{"text":"Liebe Grüße","size":5},{"text":"Wein","size":5},{"text":"podcast","size":5},{"text":"Schönen Sonntag","size":5},{"text":"Anfängen","size":5},{"text":"FrauenfussballWM","size":5},{"text":"ClimateJusticeNow","size":5},{"text":"temperaturen","size":10},{"text":"v","size":10},{"text":"dark","size":10},{"text":"Eher","size":10},{"text":"tourofslovenia","size":10},{"text":"Paris","size":10},{"text":"sebastian","size":10},{"text":"Honestly","size":5},{"text":"Trump","size":5},{"text":"Wiener","size":10},{"text":"FridaysForFuture","size":5},{"text":"Wettbewerb","size":5},{"text":"Hockenheimring","size":5},{"text":"redmadrüber","size":5},{"text":"Hockenheimring","size":5},{"text":"gedanke","size":5},{"text":"Spenden","size":5},{"text":"AlleDoerferBleiben","size":5},{"text":"Hitzewelle","size":5},{"text":"서직샵_VOPE","size":5},{"text":"McLaren","size":5},{"text":"frenchgp","size":5},{"text":"AlleDörferBleiben","size":5},{"text":"krieg","size":35},{"text":"Lied","size":35},{"text":"Beine","size":5},{"text":"TeenChoice","size":5},{"text":"sexualpädagogik","size":5},{"text":"NEOS","size":20},{"text":"synchro","size":5},{"text":"EU","size":5},{"text":"playstation","size":5},{"text":"balkon","size":5},{"text":"fridaysforfuture","size":5},{"text":"AllNightOutNow","size":10},{"text":"herr","size":10},{"text":"Früh","size":5}];

			
			var color = d3.scale.linear()
								.domain([0,20,40,50,60,80,100])
								.range(["#f1f5fa", "#97a0b3", "#89abc8", "#cc1900", "#193461"]);

			d3.layout.cloud().size([300, 300])
							 .words(frequency_list)
							 .rotate(0)
							 .fontSize(function(d) { return d.size; })
							 .on("end", draw)
							 .start();
			function draw(words) {
				d3.select("#cloud").append("svg")
								.attr("width", 500)
								.attr("height", 300)
								.attr("class", "wordcloud")
								.append("g")
								// without the transform, words words would get cutoff to the left and top, they would
								// appear outside of the SVG area
								.attr("transform", "translate(200,150)")
								.selectAll("text")
								.data(words)
								.enter().append("text")
								.style("font-size", function(d) { return d.size + "px"; })
								.style("fill", function(d, i) { return color(i); })
								.attr("transform", function(d) {
									return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
								})
								.text(function(d) { return d.text; });
			}
		};


		//Create a marker layer (in the example done via a GeoJSON FeatureCollection)
		var valencelayer = L.geoJson(Munich_time);
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
	