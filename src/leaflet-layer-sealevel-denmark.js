/****************************************************************************
	leaflet-layer-sealevel-denmark.js, 

	(c) 2016, FCOO

	https://github.com/FCOO/leaflet-layer-sealevel-denmark
	https://github.com/FCOO

****************************************************************************/
;(function ($, L, window, document, undefined) {
	"use strict";
  var latlngFormat = new window.LatLngFormat( 1 ); //1=Degrees Decimal minutes: N65°30.258'

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
            var linkTemplate = window.location.protocol + "//chart.fcoo.dk/station_timeseries.asp?s=:003${stationId}:046SeaLvl:002DK:001DEFAULT:04d620:04e400:04f0:04a1:04b48:04i0:04c1:04g0:0641:05opopup";
            var link = linkTemplate.replace('${stationId}', feature.properties.id);
            var createImage = function(link) {
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
              } else {
                var marginWidth = 41;
                var marginHeight = 73;
                var viewportWidth = $(window).width();
                var viewportHeight = $(window).height();
                var imgWidth = parseInt(0.95*viewportWidth - marginWidth);
                var imgMaxHeight = parseInt(0.95*viewportHeight - marginHeight);
                var imgAspect = 400.0/620.0;
                var imgHeight = imgAspect * imgWidth;
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
            };
            var img = createImage(link);
            container.append(img);
            var content = container.html();
            var popup = L.popup({maxWidth: 700, maxHeight: 600})
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

    initialize: function (options) {
      var msg;
      var that = this;
      L.setOptions(this, options);
      this._layers = {};
      // jqxhr is a jQuery promise to get the requested JSON data
      this.jqxhr = $.getJSON(this.options.url);
      //this.options.url = this.options.baseurl.replace('{language}', this.options.language);
      this.jqxhr.done(function (data) {
        that.addData(data);
      });
      this.jqxhr.fail(function (/*data*/) {
        msg = 'Failure retrieving station positions from ' + that.options.url;
        window.noty({text: msg, type: 'error'});
      });
    },

    onAdd: function (map) {
      var that = this;
      this.jqxhr.done(function (/*data*/) {
        L.GeoJSON.prototype.onAdd.call(that, map);
      });
    },
  });

  return L.GeoJSON.Sealevel;

}(jQuery, L, this, document));


