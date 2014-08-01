// Create a new module
var mapModule = angular.module('maps', ['geolocation']);

mapModule.factory('MapService', function($q, GeolocationService) {

  var mapServiceInstance = {};

  mapServiceInstance.initMap = function(latitude, longitude, icon) {
    var lat = latitude;
    var long = longitude;
    L.mapbox.accessToken = 'pk.eyJ1IjoiamVzc2Vyb3NhdG8iLCJhIjoiUzZUNi1GdyJ9.Dj1yzEE4SifPEq5gTR8LJA';
    var mapboxTiles = createTileLayer();
    var map = L.map('map', { zoomControl: false }).setView([lat, long], 13).addLayer(mapboxTiles);
    var zoomCtrl = L.control.zoom({position: 'topright'});
    map.addControl(zoomCtrl);
    if (icon) {
      mapServiceInstance.addMarker(map, [lat, long], icon);
    }
    return map;
  };

  mapServiceInstance.initMapOnUserPosition = function(icon)
  {
    var deferred = $q.defer();
    GeolocationService.getPosition().then(function(pos) {
      var coords = pos.coords;
      deferred.resolve(mapServiceInstance.initMap(coords.latitude, coords.longitude, icon));
    }, function(error) {
      deferred.reject(error);
    });
    return deferred.promise;
  };

  mapServiceInstance.iconFactory = function(iconUrl, shadowUrl, iconHeight, iconWidth)
  {
    return L.icon({
      iconUrl: iconUrl,
      shadowUrl: shadowUrl,
      iconSize: [iconHeight, iconWidth], // size of the icon
      shadowSize: [iconHeight, iconWidth], // size of the shadow
      iconAnchor: [0, iconWidth/2], // point of the icon which will correspond to marker's location
      shadowAnchor: [0, iconWidth/2],  // the same for the shadow
      popupAnchor: [iconHeight + 10, iconWidth/2] // point from which the popup should open relative to the iconAnchor
    });
  };

  mapServiceInstance.addMarker = function(map, location, icon)
  {
    L.marker(location, {icon: icon}).addTo(map);
  };

  function createTileLayer(map) {

    var iconAttr = 'Map Marker designed by <a href="http://www.thenounproject.com/AaronDodson">Aaron Dodson</a> from the <a href="http://www.thenounproject.com">Noun Project</a><br />'
    iconAttr += 'Pin designed by <a href="http://www.thenounproject.com/eugen.belyakoff">Eugen Belyakoff</a> from the <a href="http://www.thenounproject.com">Noun Project</a>';
    return L.tileLayer('https://{s}.tiles.mapbox.com/v3/jesserosato.j200j557/{z}/{x}/{y}.png', {
      attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a><br />' + iconAttr
    });
  }

  return mapServiceInstance;

});