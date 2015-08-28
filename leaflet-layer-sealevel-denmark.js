(function () {
    /* global L */
    'use strict';
    L.GeoJSON.Sealevel = L.GeoJSON.extend({
        options: {
            //language: 'en',
            url: 'Observations.json',
            onEachFeature: function (feature, layer) {
                var link_template = location.protocol + "//chart.fcoo.dk/station_timeseries.asp?s=:003__STATION__:046SeaLvl:002DK:001DEFAULT:04d620:04e400:04f0:04a1:04b48:04i0:04c1:04g0:0641:05opopup";
                layer.bindPopup('<img src="' + link_template.replace('__STATION__', feature.properties.id) + '" height="350" width="500" />', {maxWidth: 700, maxHeight: 600});
            },
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                           radius: 5,
                           fillColor: "#ff7800",
                           color: "#000",
                           weight: 1,
                           opacity: 1,
                           fillOpacity: 0.8
                });
            }
        },

        initialize: function (options) {
            var that = this;
            L.setOptions(this, options);
            this._layers = {};
            //this.options.url = this.options.baseurl.replace('{language}', this.options.language);
        },

        onAdd: function (map) {
            var that = this;
            $.getJSON(this.options.url, function (data) {
                that.addData(data);
                L.GeoJSON.prototype.onAdd.call(that, map);
            });
        },
  });

  return L.GeoJSON.Sealevel;

}());

