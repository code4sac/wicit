// Create a new module
var geolocation = angular.module('geolocation', []);

geolocation.factory('GeolocationService', function($q) {
  var geolocationInstance = {};
  geolocationInstance.position = false;
  geolocationInstance.getPosition = function() {
    var self = this;
    var deferred = $q.defer();
    // Check cache.
    if (this.position) {
      deferred.resolve(this.position);
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getCurrentPositionSuccessCallback, getCurrentPositionErrorCallback);
      } else {
        deferred.reject("Geolocation error.")
      }
    }

    return deferred.promise;

    /**
     * @param pos
     */
    function getCurrentPositionSuccessCallback(pos) {
      // Cache result;
      self.position = pos;
      deferred.resolve(self.position)
    }

    /**
     * @param posError
     */
    function getCurrentPositionErrorCallback(posError) {
      deferred.reject(posError);
    }

  };
  //factory function body that constructs shinyNewServiceInstance
  return geolocationInstance;
});