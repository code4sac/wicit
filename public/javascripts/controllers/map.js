/** MAP CONTROLLER */
wicItApp.controller('MapCtrl', function ($scope, $http, leafletEvents, leafletData, leafletHelpers, leafletMarkersHelpers, NotificationService, GeolocationService, Constants) {

  var defaultZoom = 13;
  var maxZoom = 18;
  var minZoom = 10;
  var pinIcon = iconFactory('image/pin.png', 'image/pin@2x.png', 'image/pin_shadow.png', 'image/pin_shadow@2x.png', 30, 30);
  var markerIcon = iconFactory('image/marker.png', 'image/marker@2x.png', 'image/marker_shadow.png', 'image/marker_shadow@2x.png', 30, 30);
  var mapId = Constants.mapboxId;
  var mapToken = Constants.mapboxToken;
  var locationsApiToken = Constants.apiToken;
  // var tileUrl = "https://{s}.tiles.mapbox.com/v4/" + mapId + "/{z}/{x}/{y}.png?access_token=" + mapToken;
  var tileUrl = "https://api.mapbox.com/styles/v1/" + mapId + "/tiles/256/{z}/{x}/{y}?access_token=" + mapToken
  var locationsBaseUrl = 'https://chhs.data.ca.gov/resource/x5nq-b49e.json';
  var prevBounds = false;
  var curBounds = false;

  $scope.mapLoading = true;

  initMap();
  initLocateButton();
  geolocateUser();

  $scope.$on('leafletDirectiveMap.moveend', function(event){
    leafletData.getMap().then(function(map) {
      if ( curBounds) {
        prevBounds = curBounds;
      }
      curBounds = map.getBounds();
      if ( ! prevBounds || ! prevBounds.contains(curBounds)) {
        updateNearbyLocations(event).then(function() {
          mapUpdating = false;
          $scope.mapLoading = false;
        });
      }
    });
  });

  // Workaround for angular-leaflet-directive issue: https://github.com/tombatossals/angular-leaflet-directive/issues/381
  $scope.$on('$destroy', function () {
    leafletMarkersHelpers.resetMarkerGroups();
  });

  function initMap()
  {
    angular.extend($scope, {
      defaults: {
        tileLayer: tileUrl,
        maxZoom: maxZoom,
        minZoom: minZoom,
        zoomControlPosition: 'bottomright',
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

  function initLocateButton()
  {
    var locateControl = L.Control.extend({
      options: {
        position: 'bottomright'
      },
      onAdd: function(map) {
        // Create the control container with a particular class name
        var container = L.DomUtil.create('div', 'locate-control');
        // Attach event listeners
        L.DomEvent.addListener(container, 'click', function() {
          geolocateUser({forceUpdate: true});
        });
        var controlUI = L.DomUtil.create('div', 'leaflet-control-command-interior', container);
        // controlUI.title = 'Map Commands';
        return container;
      }
    });
    $scope.controls = {
      custom: [
        new locateControl()
      ]
    };
  }

  function geolocateUser(options)
  {
    GeolocationService.getPosition(options).then(setUserLocation, geolocationError);
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
   */
  function updateNearbyLocations(event) {
    mapUpdating = true;
    var nw = curBounds.getNorthWest();
    var se = curBounds.getSouthEast();
    var locationsUrl = locationsBaseUrl;
    locationsUrl += '?$where=within_box(location,' + nw.lat + ',' + nw.lng + ',' + se.lat + ',' + se.lng + ')';
    locationsUrl += '&$$app_token=' + locationsApiToken;
    return $http.get(locationsUrl).success(displayLocations).error(updateNearbyLocationsError);

    function displayLocations(data) {
      data.forEach(function (vendor) {
        var lat = parseFloat(vendor.location.latitude);
        var lng = parseFloat(vendor.location.longitude);
        var name = vendor.vendor;
        var city = vendor.city;
        var zip = vendor.zip_code;
        var address = vendor.address;
        // Data has some weird ones where second address is just a space, double quotes and a space.
        if (vendor.second_address && vendor.second_address.indexOf('"') < 0) {
          address += ' ' + vendor.second_address;
        }
        address += ', ' + city + ' ' + zip;
        var message ='<h3>' + name + '</h3><p class="address">' + address + '</p><p class="directions"><a href="https://maps.google.com?saddr=Current+Location&daddr=' + address + '" target="_blank">Directions</a></p>';
        $scope.markers[keyify(name)] = {
          group: vendor.county,
          groupOption: { showCoverageOnHover: false },
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

  function iconFactory(iconUrl, iconRetinaUrl, shadowUrl, shadowRetinaUrl, iconHeight, iconWidth)
  {
    return {
      iconUrl: iconUrl,
      iconRetinaUrl: iconRetinaUrl,
      shadowUrl: shadowUrl,
      shadowRetinaUrl: shadowRetinaUrl,
      iconSize: [iconHeight, iconWidth], // size of the icon
      shadowSize: [iconHeight, iconWidth], // size of the shadow
      iconAnchor: [0, iconWidth/2], // point of the icon which will correspond to marker's location
      shadowAnchor: [0, iconWidth/2],  // the same for the shadow
      popupAnchor: [iconWidth/2, -10] // point from which the popup should open relative to the iconAnchor
    };
  };

});
