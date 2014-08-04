var constants = angular.module('wicItApp.Constants', [])
  .constant('ServerConstants', {
    MAPBOX_MAP_ID: 'jesserosato.j200j557'
  });
var wicItApp = angular.module('wicItApp', ['wicItApp.Constants', 'notifications', 'geolocation', 'leaflet-directive']);
wicItApp.controller('mapCtrl', mapCtrl);