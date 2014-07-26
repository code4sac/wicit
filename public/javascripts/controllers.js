var wicItApp = angular.module('wicItApp', ['notifications', 'geolocation']);

/** MAP CONTROLLER */
var mapCtrl;
mapCtrl = function ($scope, $http, $timeout, GeolocationService, NotificationService) {

  var lat;
  var long;
  var map;
  var mapUpdating = false;;

  $scope.mapLoading = true;

  GeolocationService.getPosition(initMap, geolocationError);

  // TODO: MOVE MAP STUFF TO SERVICE.
  function geolocationError(message) {
    $scope.$apply(function () {
      $scope.mapLoading = false;
    });
    NotificationService.addNotificiation({
      message: message,
      status: NotificationService.STATUSES.ERROR
    });
  }

  function initMap(latitude, longitude) {
    $scope.$apply(function () {
      $scope.mapLoading = false;
    });
    lat = '33.86430130900044'; //latitude;
    long = '-118.39718642699972'; //longitude;
    map = L.map('map', { zoomControl: false }).setView([lat, long], 13);
    var zoomCtrl = L.control.zoom({position: 'topright'});
    map.addControl(zoomCtrl);
    createMapTileLayer(map);

    var pinIcon = createMapIcon('pin');

    L.marker([lat, long], {icon: pinIcon}).addTo(map);

    updateNearbyLocations();

    map.on('moveend', updateNearbyLocations);
  }

  function createMapIcon(icon) {
    return L.icon({
      iconUrl: 'image/' + icon + '.png',
      shadowUrl: 'image/' + icon + '_shadow.png',
      iconSize: [30, 30], // size of the icon
      shadowSize: [30, 30], // size of the shadow
      iconAnchor: [0, 15], // point of the icon which will correspond to marker's location
      shadowAnchor: [0, 15],  // the same for the shadow
      popupAnchor: [40, 15] // point from which the popup should open relative to the iconAnchor
    });
  }

  function createMapTileLayer(map) {
    var iconAttr = 'Map Marker designed by <a href="http://www.thenounproject.com/AaronDodson">Aaron Dodson</a> from the <a href="http://www.thenounproject.com">Noun Project</a><br />'
    iconAttr += 'Pin designed by <a href="http://www.thenounproject.com/eugen.belyakoff">Eugen Belyakoff</a> from the <a href="http://www.thenounproject.com">Noun Project</a>';
    var mqTilesAttr = 'Tiles &copy; <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png" />';
    // add MapQuest tile layer, must give proper OpenStreetMap attribution according to MapQuest terms
    L.tileLayer('http://otile4.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {attribution: mqTilesAttr + "<br />" + iconAttr}).addTo(map);
  }

  function updateNearbyLocations(e) {
    // Update
    if (mapUpdating) {
      return false;
    }
    mapUpdating = true;
    $http.get('/locations').success(displayNearbyLocations).error(getNearbyLocationsError);

    function displayNearbyLocations(data, status, headers, config) {
      // Only update markers every 1.5 seconds
      $timeout(function() {
        mapUpdating = false;
      }, 1500);
      var markerIcon = createMapIcon('marker');
      data.forEach(function (location) {
        L.marker([location.location_1.latitude, location.location_1.longitude], {icon: markerIcon}).addTo(map);
      });
    }

    function getNearbyLocationsError(data, status, headers, config) {
      NotificationService.addNotificiation({
        message: "Unable to load nearby locations.",
        status: NotificationService.STATUSES.ERROR
      })
    }

  }
};

wicItApp.controller('mapCtrl', mapCtrl);