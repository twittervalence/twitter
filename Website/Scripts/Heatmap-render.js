//Heatmap layer
var Heatmap_data = {
	max: 5,
	data: []
};
for (var i=0;i<Brussel_time.length;i++)
{
	if (Number(Brussel_time[i].features.properties.polarity)>0){
		var point_lat = Brussel_time[i].features.geometry.coordinates[0];
		var point_lng = Brussel_time[i].features.geometry.coordinates[1];
		var point_polarity = Number(Brussel_time[i].features.properties.polarity);
		var point_need = {
			lat : point_lng,
			lng : point_lat,
			polarity : point_polarity
		};
		Heatmap_data.data.push(point_need);
	}		
};
var cfg = {
	// radius should be small ONLY if scaleRadius is true (or small radius is intended)
	// if scaleRadius is false it will be the constant radius used in pixels
	"radius": 0.005,
	"maxOpacity": .8, 
	// scales the radius based on map zoom
	"scaleRadius": true, 
	// if set to false the heatmap uses the global maximum for colorization
	// if activated: uses the data maximum within the current map boundaries 
	//   (there will always be a red spot with useLocalExtremas true)
	"useLocalExtrema": true,
	// which field name in your data represents the latitude - default "lat"
	latField: 'lat',
	// which field name in your data represents the longitude - default "lng"
	lngField: 'lng',
	// which field name in your data represents the data value - default "value"
	valueField: 'polarity'
};
var heatmapLayer = new HeatmapOverlay(cfg);
heatmapLayer.setData(Heatmap_data);