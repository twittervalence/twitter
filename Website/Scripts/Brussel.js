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
			weight: 0.5,
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

	var geojson = L.geoJson(Brussel_dist, { style: style, onEachFeature: onEachFeature }).addTo(map);

	var Brussels = {
		"Brussels": geojson,
	}
	
	var MapControl = L.control.layers(baseMaps, Brussels, Heatmap).addTo(map);

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

		// var geojson = L.geoJson(Brussel_dist, { style: style, onEachFeature: onEachFeature }).addTo(map);

		function onEachFeature(feature, layer) {
			layer.on({
				click: zoomFocus,
				mouseover: performHover,
				mouseout: destroyHover, 
			});
		}

		function style(feature) {
			return {
				fillColor: "#00A884",
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
			document.getElementById("cloud").innerHTML = " ";

			//draw the word cloud

			var frequency_list = [{"text":"Flagey","size":40},{"text":"CAN2017","size":15},{"text":"nicki","size":10},{"text":"hittegolf","size":15},{"text":"ChoiceInternationalArtist","size":10},{"text":"THOSbe","size":5},{"text":"leuven","size":10},{"text":"Leterme","size":5},{"text":"properehanden","size":5},{"text":"Koh Lanta","size":85},{"text":"Kennis","size":5},{"text":"lichtendenachtwolken","size":5},{"text":"Israel","size":15},{"text":"Mehdi Bayat","size":45},{"text":"gote","size":30},{"text":"EU","size":5},{"text":"education","size":5},{"text":"nafi thiam","size":10},{"text":"Kitty Van Nieuwenhuysen","size":120},{"text":"weekend","size":5},{"text":" nafi thia","size":15},{"text":"nekfeu","size":15},{"text":"kennis","size":15},{"text":"Vögel","size":15},{"text":"brussels","size":15},{"text":"BRUSSELS","size":20},{"text":"okay","size":15},{"text":"WizardsUnite","size":15},{"text":"Naamsepoort","size":15},{"text":"Indien ","size":15},{"text":"Istanbul","size":15},{"text":"pourtant","size":15},{"text":"Italië","size":25},{"text":"Nekfeu","size":5},{"text":"ROMA","size":15},{"text":"Halle","size":5},{"text":"holy","size":10},{"text":"kitty van nieuwenhuysen","size":5},{"text":"FortBoyard","size":5},{"text":"brexit","size":5},{"text":"WeLoveYouHoseok","size":10},{"text":"Nederlandse","size":10},{"text":"ToyStory3","size":10},{"text":"nicki","size":5},{"text":"FortBoyard","size":10},{"text":"Frituur","size":15},{"text":"AUEU4farmers","size":5},{"text":"Les 2","size":5},{"text":"les 2","size":5},{"text":"qu'est-ce","size":5},{"text":"Ferme","size":5},{"text":"Cameron","size":5},{"text":"UK","size":5},{"text":"EU","size":5},{"text":"meeting","size":5},{"text":"elections","size":5},{"text":"maravilhosas","size":5},{"text":"scoiale","size":5},{"text":"fraude","size":5},{"text":"aanpakken","size":5},{"text":"realistische","size":5},{"text":"iran","size":5},{"text":"temperaturen","size":10},{"text":"ESLProLeague","size":10},{"text":"beide","size":10},{"text":"voor elkaars","size":10},{"text":"Canim","size":10},{"text":"Beni","size":10},{"text":"Bruxelas","size":10},{"text":"Peter","size":5},{"text":"ARAMIS","size":5},{"text":"coisas","size":10},{"text":"Plus jamais","size":5},{"text":"policiers","size":5},{"text":"Nederlandse","size":5},{"text":"Antwerpen","size":15},{"text":"parlaient","size":5},{"text":"Dans","size":5},{"text":"thankYou","size":5},{"text":"Markt","size":5},{"text":"souviens","size":5},{"text":"JuliaaCheers","size":5},{"text":"LaVanguardia","size":5},{"text":"financiado","size":5},{"text":"sistema","size":5},{"text":"krieg","size":35},{"text":"Patourose","size":35},{"text":"mange","size":5},{"text":"#TeenChoice","size":5},{"text":"Bonheur","size":5},{"text":"Malavita","size":20},{"text":"EU","size":5},{"text":"IvanhaMpanzi","size":5},{"text":"playstation","size":5},{"text":"MissWorld","size":5},{"text":"MissBbfine","size":5},{"text":"Bonheur","size":10},{"text":"WorldCup","size":10},{"text":"Kitty Van Nieuwenhuysen","size":5}];
			
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
		var valencelayer = L.geoJson(Brussel_time);
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
	