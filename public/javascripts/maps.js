// Create a new module
var mapModule = angular.module('maps', ['geolocation']);

mapModule.factory('MapService', function($q, GeolocationService) {

  var mapServiceInstance = {};

  mapServiceInstance.initMap = function(latitude, longitude, icon) {
    var lat = '33.86430130900044'; //latitude;
    var long = '-118.39718642699972'; //longitude;
    var map = L.map('map', { zoomControl: false }).setView([lat, long], 13);
    var zoomCtrl = L.control.zoom({position: 'topright'});
    map.addControl(zoomCtrl);
    createMapTileLayer(map);
    mapServiceInstance.addMarker(map, [lat, long], icon);
    return map;
  };

  mapServiceInstance.initMapOnUserPosition = function(icon)
  {
    var deferred = $q.defer();
    GeolocationService.getPosition().then(function(lat, long) {
      deferred.resolve(mapServiceInstance.initMap(lat, long, icon));
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

  function createMapTileLayer(map) {
    var iconAttr = 'Map Marker designed by <a href="http://www.thenounproject.com/AaronDodson">Aaron Dodson</a> from the <a href="http://www.thenounproject.com">Noun Project</a><br />'
    iconAttr += 'Pin designed by <a href="http://www.thenounproject.com/eugen.belyakoff">Eugen Belyakoff</a> from the <a href="http://www.thenounproject.com">Noun Project</a>';
    var mqTilesAttr = 'Tiles &copy; <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png" />';
    // add MapQuest tile layer, must give proper OpenStreetMap attribution according to MapQuest terms
    L.tileLayer('http://otile4.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {attribution: mqTilesAttr + "<br />" + iconAttr}).addTo(map);
  }

  return mapServiceInstance;

});