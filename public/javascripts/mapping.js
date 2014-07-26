// Create a new module
var mapping = angular.module('mapping', ['geolocation']);

mapping.factory('MapService', function() {

  var mapServiceInstance = {};

  return mapServiceInstance;

});