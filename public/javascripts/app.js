var constants = {
  MAPBOX_MAP_ID: 'jesserosato.j200j557'
};
angular.module('wicItApp.Constants', []).constant('ServerConstants', constants);

var wicItApp = angular.module('wicItApp', ['wicItApp.Constants', 'ui.router', 'ngAnimate', 'leaflet-directive', 'geolocation', 'notifications']);
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
    .state('qualify.residency', {
      url: '/residency',
      templateUrl: '/partials/qualify/residency'
    })
    .state('qualify.category', {
      url: '/category',
      templateUrl: '/partials/qualify/category'
    })
    .state('qualify.income', {
      url: '/category',
      templateUrl: '/partials/qualify/income'
    })
  .state('about', {
    url: '/about',
    templateUrl: '/partials/about'
  });
});
