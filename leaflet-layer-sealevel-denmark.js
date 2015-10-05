(function () {
    /* global L */
    'use strict';
    var latlngFormat = new LatLngFormat( 1 ); //1=Degrees Decimal minutes: N65°30.258'

    L.GeoJSON.Sealevel = L.GeoJSON.extend({
        options: {
            //language: 'en',
            //url: '../bower_components/leaflet-layer-sealevel-denmark/sealevel_stations_denmark.json',
            url: '../json/sealevel_stations_denmark.json',
            onEachFeature: function (feature, layer) {
                // Use click handler for substituting timezone information
                layer.on({
                    click: function (evt) {
                        var container = $('<div/>');
                        var headerTemplate = '<h3 class="leaflet-layer-sealevel-denmark-header">${name} - ${position}</h3>';
                        var position = '${latitude}, ${longitude}';
                        var lng = feature.geometry.coordinates[0];
                        var lat = feature.geometry.coordinates[1];
                        position = position.replace('${longitude}', latlngFormat.asTextLng(lng));
                        position = position.replace('${latitude}', latlngFormat.asTextLat(lat));
                        var header = headerTemplate.replace('${name}', feature.properties.nameDK);
                        header = header.replace('${position}', position);
                        container.append($(header));
                        var linkTemplate = location.protocol + "//chart.fcoo.dk/station_timeseries.asp?s=:003${stationId}:046SeaLvl:002DK:001DEFAULT:04d620:04e400:04f0:04a1:04b48:04i0:04c1:04g0:0641:05opopup";
                        var link = linkTemplate.replace('${stationId}', feature.properties.id);
                        var img = $('<img src="' + link + '" height="400" width="620" />');
                        container.append(img);
                        layer._map.openPopup(container.html(), evt.latlng, {maxWidth: 700, maxHeight: 600});
                    }
                });

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

