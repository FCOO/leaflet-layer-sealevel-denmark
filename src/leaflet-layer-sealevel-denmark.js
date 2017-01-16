/****************************************************************************
    leaflet-layer-sealevel-denmark.js, 

    (c) 2016, FCOO

    https://github.com/FCOO/leaflet-layer-sealevel-denmark
    https://github.com/FCOO

****************************************************************************/
(function ($, L, window/*, document, undefined*/) {
    "use strict";
    var protocol = window.location.protocol == 'https:' ? 'https:' : 'http:';

    L.GeoJSON.Sealevel = L.GeoJSON.extend({
        options: {
            //language: 'en',
            //url: '../bower_components/leaflet-layer-sealevel-denmark/sealevel_stations_denmark.json',
            url: '../json/sealevel_stations_denmark.json',
            onEachFeature: function (feature, layer) {
                // Use click handler for substituting timezone information
                layer.on({
                    click: function (evt) {
                        var container = $('<div/>'),
                            headerTemplate = '<h3 class="leaflet-layer-sealevel-denmark-header">${name} - ${position}</h3>',
                            //position = '${latitude}, ${longitude}',
                            latLng = L.latLng( feature.geometry.coordinates[1], feature.geometry.coordinates[0] ),
                            //position = position.replace('${longitude}', latlngFormat.asTextLng(lng));
                            //position = position.replace('${latitude}', latlngFormat.asTextLat(lat));
                            header = headerTemplate.replace('${name}', feature.properties.nameDK);
                            //header = header.replace('${position}', position);

                        header = header.replace('${position}', latLng.asFormat().join('&nbsp;&nbsp;&nbsp;'));
                        container.append($(header));

                        var linkTemplate = protocol + "//chart.fcoo.dk/station_timeseries.asp?s=:003${stationId}:046SeaLvl:002DK:001DEFAULT:04d620:04e400:04f0:04a1:04b48:04i0:04c1:04g0:0641:05opopup",
                            link = linkTemplate.replace('${stationId}', feature.properties.id),
                            createImage = function(link) {
                                // Default to large screen size
                                var query = true;
                                if (typeof window.matchMedia != "undefined" || typeof window.msMatchMedia != "undefined") {
                                    var mq = window.matchMedia('(min-width: 661px)');
                                    //var mq = window.matchMedia('screen and (orientation: landscape) and (min-width: 641px) and (min-height: 481px), screen and (orientation: portrait) and (min-width: 481px) and (min-height: 641px)');
                                    query = mq.matches;
                                }
                                var img;
                                if (query) {
                                    img = $('<img src="' + link + '" height="400" width="620" />');
                                } 
                                else {
                                    var marginWidth = 41,
                                        marginHeight = 73,
                                        viewportWidth = $(window).width(),
                                        viewportHeight = $(window).height(),
                                        imgWidth = parseInt(0.95*viewportWidth - marginWidth),
                                        imgMaxHeight = parseInt(0.95*viewportHeight - marginHeight),
                                        imgAspect = 400.0/620.0,
                                        imgHeight = imgAspect * imgWidth;
                                    // Scale image if too high
                                    if (imgHeight > imgMaxHeight) {
                                        var imgRescale = imgMaxHeight / imgHeight;
                                        imgHeight = imgMaxHeight;
                                        imgWidth = imgRescale * imgWidth;
                                    }
                                    // Ensure non-negative sizes
                                    imgHeight = Math.max(imgHeight, 0);
                                    imgWidth = Math.max(imgWidth, 0);
                                    img = $('<img src="' + link + '" height="' + imgHeight + '" width="' + imgWidth + '" />');
                                }
                                return img;
                            },
                            img = createImage(link);
                        container.append(img);
                        var content = container.html(),
                            popup = L.popup({maxWidth: 700, maxHeight: 600})
                                        .setLatLng(evt.latlng)
                                        .setContent(content);
                        layer._map.openPopup(popup);

                        // Resize image when viewport size changes
                        var resizeCallback = function (/*evtResize*/) {
                            var newImg = createImage(link);
                            container.find('img').replaceWith(newImg);
                            popup.setContent(container.html());
                        };
                        $(window).on('resize orientationchange', resizeCallback);
                        // Remove resize event listener when popup closed
                        layer._map.on('popupclose', function(/*evtPopup, ee*/) {
                            $(window).off('resize orientationchange', resizeCallback);
                        });
                    }
                });
            }, //end of onEachFeature: function (feature, layer) {...

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

        initialize: function (options) {
            var msg;
            var _this = this;
            L.setOptions(this, options);
            this._layers = {};
            // jqxhr is a jQuery promise to get the requested JSON data
            this.jqxhr = $.getJSON(this.options.url);
            //this.options.url = this.options.baseurl.replace('{language}', this.options.language);
            this.jqxhr.done(function (data) {
                _this.addData(data);
            });
            this.jqxhr.fail(function (/*data*/) {
                msg = 'Failure retrieving station positions from ' + _this.options.url;
                window.noty({text: msg, type: 'error'});
            });
        },

        onAdd: function (map) {
            var _this = this;
            this.jqxhr.done(function (/*data*/) {
                L.GeoJSON.prototype.onAdd.call(_this, map);
            });
        },
    });

    return L.GeoJSON.Sealevel;

}(jQuery, L, this, document));



