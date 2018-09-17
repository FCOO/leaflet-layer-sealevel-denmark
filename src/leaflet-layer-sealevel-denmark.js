/****************************************************************************
    leaflet-layer-sealevel-denmark.js,

    (c) 2016, FCOO

    https://github.com/FCOO/leaflet-layer-sealevel-denmark
    https://github.com/FCOO

****************************************************************************/
(function ($, L, window/*, document, undefined*/) {
    "use strict";

    var imgWidth = 600,
        imgHeight = 400;

    function layerSealevelOnPopupopen( popupEvent ){
        var popup = popupEvent.popup,
            layer = popup._source,
            lang = window.i18next.language.toUpperCase() == 'DA' ? 'DA' : 'ENG',
            link =
                (window.location.protocol == 'https:' ? 'https:' : 'http:') +
                '//chart.fcoo.dk/station_timeseries.asp?' +
                    'LANG=' + lang + '&' +
                    'USER=DEFAULT&' +
                    'PARAMID=SeaLvl&' +
                    'WIDTH=' + imgWidth + '&' +
                    'HEIGHT=' + imgHeight + '&' +
                    'FORECASTMODE=1&' +
                    'HEADER=0&' +
                    'NOLOGO=1&' +
                    'MODE=0&' +
                    'INFOBOX=1&' +
                    'FORECASTPERIOD=48&' +
                    'HINDCASTPERIOD=24&' +
                    'MODE=popup&' +
                    'ID=' + layer.feature.properties.id,

                $img = $('<img/>')
                    .attr('src', link)
                    .css({width: imgWidth, height: imgHeight });

        popup.changeContent( $img );
    }


    L.GeoJSON.Sealevel = L.GeoJSON.extend({
        options: {
            url: '../json/sealevel_stations_denmark.json',
            onEachFeature: function (feature, layer) {
                layer.bindPopup({
                    width  : 15 + imgWidth + 15,
                    fixable: true,
                    scroll : 'horizontal',
                    header : [
                        {icon: 'fa-chart-line', text: {da: feature.properties.nameDK, en: feature.properties.nameENG}},
                        '&nbsp;',
                        L.latLng( feature.geometry.coordinates[1], feature.geometry.coordinates[0] ).format().join('&nbsp;&nbsp;&nbsp;')
                    ],
                    //Add 'dummy' content to get popup dimentions correct on first open
                    content: $('<div/>').css({
                                width: imgWidth,
                                height: imgHeight
                             })
                });

                layer.on('popupopen', layerSealevelOnPopupopen );

            },

            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                                        radius: 7,
                                        fillColor: "#ff7800",
                                        color: "#000",
                                        weight: 1,
                                        opacity: 1,
                                        fillOpacity: 0.8
                                    });
            }
        },

        initialize: function(initialize){
            return function (options) {
                initialize.call(this, null, options);

                //Read the meta-data
                var _this = this;
                window.Promise.getJSON( this.options.url, {}, function( data ){ _this.addData( data );} );
            };
        } (L.GeoJSON.prototype.initialize)
    });

    return L.GeoJSON.Sealevel;

}(jQuery, L, this, document));



