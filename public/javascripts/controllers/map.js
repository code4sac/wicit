/** MAP CONTROLLER */
var mapCtrl = function ($scope, $http, $timeout, leafletEvents, leafletData, NotificationService, GeolocationService, ServerConstants) {

  var defaultZoom = 13;
  var maxZoom = 18;
  var pinIcon = iconFactory('image/pin.png', 'image/pin_shadow.png', 30, 30);
  var markerIcon = iconFactory('image/marker.png', 'image/marker_shadow.png', 30, 30);
  var mapId = ServerConstants.MAPBOX_MAP_ID;
  var tileUrl = "https://{s}.tiles.mapbox.com/v3/" + mapId + "/{z}/{x}/{y}.png";
  var locationsBaseUrl = 'http://health.data.ca.gov/resource/i7wi-ei4m.json';
  var locationsAppToken = 'S0kfDwCy0pFWq18dpMK7JADbT';
  var prevBounds = false;
  var curBounds = false;

  $scope.mapLoading = true;

  initMap();

  GeolocationService.getPosition().then(setUserLocation, geolocationError);

  $scope.$on('leafletDirectiveMap.moveend', function(event){
    leafletData.getMap().then(function(map) {
      if ( curBounds) {
        prevBounds = curBounds;
      }
      curBounds = map.getBounds();
      if ( ! prevBounds || ! prevBounds.contains(curBounds)) {
        updateNearbyLocations(event).then(function() { mapUpdating = false });
      }
    });
  });

  function initMap()
  {
    angular.extend($scope, {
      defaults: {
        tileLayer: tileUrl,
        maxZoom: maxZoom,
        zoomControlPosition: 'topright',
        tileLayerOptions: {
          detectRetina: true,
          reuseTiles: true
        }
      },
      // Use Sacramento as default center
      center: {
        lat: 38.5556,
        lng: -121.4689,
        zoom: defaultZoom
      },
      markers: {
        user: {
          lat: 38.5556,
          lng: -121.4689,
          focus: true,
          icon: pinIcon
        }
      }
    });
  }

  function setUserLocation(position)
  {
    $scope.mapLoading = false;
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    $scope.center = {
      lat: lat,
      lng: lng,
      zoom: defaultZoom
    };
    $scope.markers.user.lat = lat;
    $scope.markers.user.lng = lng;
  }

  function geolocationError(geolocationError) {
    var message = geolocationError.code == geolocationError.PERMISSION_DENIED ? "Dang, geolocation is disabled." : "Dang, we can't get your location.";
    NotificationService.addNotificiation({
      message: message,
      status: NotificationService.STATUSES.ERROR
    });
    $scope.mapLoading = false;
  }

  /**
   * Update the map with nearby locations
   * TODO: Use real data.
   * TODO: search in map bounding box
   */
  function updateNearbyLocations(event) {
    mapUpdating = true;
    var bounds = event.bounds;
    // var nw = bounds.getNorthWest();
    // var se = bounds.getSouthEast();
    var locationsUrl = '/locations';
    // var locationsUrl = locationsBaseUrl;
    // locationsUrl += '&$where=within_box(location, ' + nw.lat + ', ' + nw.long + ', ' + se.lat + ', ' + se.long + ')';
    return $http.get(locationsUrl).success(displayLocations).error(updateNearbyLocationsError);

    function displayLocations(data) {
      data.forEach(function (vendor) {
        var lat = parseFloat(vendor.location.latitude);
        var lng = parseFloat(vendor.location.longitude);
        var name = vendor.vendor;
        var city = vendor.city;
        var zip = vendor.zip_code;
        var address = vendor.address + ' ' + vendor.second_address + ', ' + city + ' ' + zip;
        var message ='<h3>' + name + '</h3><p class="address">' + address + '</p><p class="directions"><a href="https://maps.google.com?saddr=Current+Location&daddr=' + address + '" target="_blank">Directions</a></p>';
        $scope.markers[keyify(name)] = {
          group: vendor.county,
          lat: lat,
          lng: lng,
          focus: false,
          message: message,
          icon: markerIcon
        }
      });
    }

    function updateNearbyLocationsError(data, status, headers, config) {
      NotificationService.addNotificiation({
        message: "Unable to load nearby locations.",
        status: NotificationService.STATUSES.ERROR
      })
    }

  }

  function keyify(orig)
  {
    return orig.replace(/\W/g, '');
  }

  function iconFactory(iconUrl, shadowUrl, iconHeight, iconWidth)
  {
    return {
      iconUrl: iconUrl,
      shadowUrl: shadowUrl,
      iconSize: [iconHeight, iconWidth], // size of the icon
      shadowSize: [iconHeight, iconWidth], // size of the shadow
      iconAnchor: [0, iconWidth/2], // point of the icon which will correspond to marker's location
      shadowAnchor: [0, iconWidth/2],  // the same for the shadow
      popupAnchor: [iconWidth/2, 0] // point from which the popup should open relative to the iconAnchor
    };
  };

};