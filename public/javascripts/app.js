var constants = {
  MAPBOX_MAP_ID: 'jesserosato.j200j557'
};
angular.module('wicItApp.Constants', []).constant('ServerConstants', constants);

var wicItApp = angular.module('wicItApp', ['wicItApp.Constants', 'ui.router', 'ngAnimate', 'leaflet-directive', 'geolocation', 'notifications']);

var mapState = {
  name: 'map',
  url: '/map',
  templateUrl: '/partials/map'
};

var qualifyState = {
  name: 'qualify',
  abstract: true,
  url: '/qualify',
  templateUrl: '/partials/qualify',
  controller: 'QualifyCtrl'
};

var qualifyResidencyState = {
  name: 'qualify.residency',
  url: '',
  parent: qualifyState,
  templateUrl: '/partials/qualify-residency'
};

var qualifyCategoryState = {
  name: 'qualify.category',
  parent: qualifyState,
  url: '/category',
  templateUrl: '/partials/qualify-category'
};

var qualifyIncomeState = {
  name: 'qualify.income',
  parent: qualifyState,
  url: '/income',
  templateUrl: '/partials/qualify-income'
};

var aboutState = {
  name: 'about',
  url: '/about',
  templateUrl: '/partials/about'
};

wicItApp.config(function($stateProvider, $urlRouterProvider) {
  // For any unmatched url, redirect to /map
  $urlRouterProvider.otherwise("/map");
  // Now set up the states
  $stateProvider
    .state(mapState)
    .state(qualifyState)
    .state(qualifyResidencyState)
    .state(qualifyCategoryState)
    .state(qualifyIncomeState)
    .state(aboutState);
});