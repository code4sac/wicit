var wicItApp = angular.module('wicItApp', ['notifications', 'maps']);

/** MAP CONTROLLER */
var mapCtrl;
mapCtrl = function ($scope, $http, $timeout, NotificationService, MapService) {

  var map;
  var pinIcon = MapService.iconFactory('image/pin.png', 'image/pin_shadow.png', 30, 30);
  var markerIcon = MapService.iconFactory('image/marker.png', 'image/marker_shadow.png', 30, 30);
  var locationsBaseUrl = 'http://health.data.ca.gov/resource/i7wi-ei4m.json';
  var locationsAppToken = 'S0kfDwCy0pFWq18dpMK7JADbT';
  var mapUpdating = false;
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
      if ( ! mapUpdating) {
        updateNearbyLocations(e).then(function() { mapUpdating = false });
      }
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
   * TODO: search in map bounding box
   */
  function updateNearbyLocations() {
    mapUpdating = true;
    var bounds = map.getBounds();
    var nw = bounds.getNorthWest();
    var se = bounds.getSouthEast();
    var locationsUrl = '/locations';
    // var locationsUrl = locationsBaseUrl;
    // locationsUrl += '&$where=within_box(location, ' + nw.lat + ', ' + nw.long + ', ' + se.lat + ', ' + se.long + ')';
    return $http.get(locationsUrl).success(displayLocations).error(updateNearbyLocationsError);

    function displayLocations(data) {
      data.forEach(function (vendor) {
        var lat = vendor.location.latitude;
        var long = vendor.location.longitude;
        var name = vendor.vendor;
        var address = vendor.address;
        var city = vendor.city;
        var zip = vendor.zip_code;
        MapService.addMarker(map, [lat, long], markerIcon);
        return $timeout(function(){}, 1500);
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