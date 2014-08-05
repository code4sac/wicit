var constants = {
  MAPBOX_MAP_ID: 'jesserosato.j200j557'
};
angular.module('wicItApp.Constants', []).constant('ServerConstants', constants);

var wicItApp = angular.module('wicItApp', ['wicItApp.Constants', 'ui.router', 'leaflet-directive', 'geolocation', 'notifications']);
wicItApp.config(function($stateProvider, $urlRouterProvider) {
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/map");
  //
  // Now set up the states
  $stateProvider
  .state('map', {
      url: '/map',
      templateUrl: '/partials/map'
  })
  .state('qualify', {
      url: '/qualify',
      templateUrl: '/partials/qualify'
  })
  .state('about', {
    url: '/about',
    templateUrl: '/partials/about'
  });
});
