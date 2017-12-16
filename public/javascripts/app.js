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
  abstract: true,
  url: '/category',
  templateUrl: '/partials/qualify-category'
};

var qualifyCategoryPregnantState = {
  name: 'qualify.category.pregnant',
  parent: qualifyCategoryState,
  url : '',
  templateUrl: '/partials/qualify-category-pregnant'
};

var qualifyCategoryBreastfeedingState = {
  name: 'qualify.category.breastfeeding',
  parent: qualifyCategoryState,
  url : '/category/breastfeeding',
  templateUrl: '/partials/qualify-category-breastfeeding'
};

var qualifyCategoryInfantState = {
  name: 'qualify.category.infant',
  parent: qualifyCategoryState,
  url : '/category/infant',
  templateUrl: '/partials/qualify-category-infant'
};

var qualifyCategoryChildState = {
  name: 'qualify.category.child',
  parent: qualifyCategoryState,
  url : '/category/child',
  templateUrl: '/partials/qualify-category-child'
};

var qualifyCategoryOtherProgramsState = {
  name: 'qualify.category.otherprograms',
  parent: qualifyCategoryState,
  url : '/category/other-programs',
  templateUrl: '/partials/qualify-category-otherprograms'
};

var qualifyIncomeState = {
  name: 'qualify.income',
  parent: qualifyState,
  url: '/income',
  templateUrl: '/partials/qualify-income'
};

var qualifyResultState = {
  name: 'qualify.result',
  parent: qualifyState,
  url: '/result',
  templateUrl: '/partials/qualify-result'
};

var aboutState = {
  name: 'about',
  url: '/about',
  templateUrl: '/partials/about'
};

var searchState = {
  name: 'search',
  url: '/search',
  templateUrl: '/partials/search',
  controller: 'SearchCtrl'
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
    .state(qualifyCategoryPregnantState)
    .state(qualifyCategoryBreastfeedingState)
    .state(qualifyCategoryInfantState)
    .state(qualifyCategoryChildState)
    .state(qualifyCategoryOtherProgramsState)
    .state(qualifyIncomeState)
    .state(qualifyResultState)
    .state(aboutState)
    .state(searchState);
});