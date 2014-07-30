var wicItApp = angular.module('wicItApp', ['notifications', 'maps']);

/** MAP CONTROLLER */
var mapCtrl;
mapCtrl = function ($scope, $http, $timeout, NotificationService, MapService) {

  var map;
  var pinIcon = MapService.iconFactory('image/pin.png', 'image/pin_shadow.png', 30, 30);
  var markerIcon = MapService.iconFactory('image/marker.png', 'image/marker_shadow.png', 30, 30);
  var mapUpdating = false

  $scope.mapLoading = true;
  var promise = MapService.initMapOnUserPosition(pinIcon);
  promise.then(initMap, geolocationError);
  promise["finally"](function() {
    $scope.mapLoading = false;
  });

  function initMap(theMap) {
    map = theMap;
    updateNearbyLocations();
    map.on('moveend', function(e) {
      updateNearbyLocations(e);
    });
  }

  function geolocationError(geolocationError) {
    var message = geolocationError.code == geolocationError.PERMISSION_DENIED ? "Dang, geolocation is disabled." : "Dang, we can't get your location.";
    NotificationService.addNotificiation({
      message: message,
      status: NotificationService.STATUSES.ERROR
    });
  }

  /**
   * Update the map with nearby locations
   * TODO: Use real data.
   * TODO: search on map center.
   */
  function updateNearbyLocations() {
    // Update
    if (mapUpdating) {
      return false;
    }
    mapUpdating = true;
    // TODO: only query server for nearby locations.
    $http.get('/locations').success(displayLocations).error(updateNearbyLocationsError);
    // Only update markers every 1.5 seconds
    return $timeout(function() { mapUpdating = false; }, 1500);

    function displayLocations(data) {
      data.forEach(function (location) {
        MapService.addMarker(map, [location.location_1.latitude, location.location_1.longitude], markerIcon)
      });
    }

    function updateNearbyLocationsError(data, status, headers, config) {
      NotificationService.addNotificiation({
        message: "Unable to load nearby locations.",
        status: NotificationService.STATUSES.ERROR
      })
    }

  }
};

wicItApp.controller('mapCtrl', mapCtrl);