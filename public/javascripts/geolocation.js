// Create a new module
var geolocation = angular.module('geolocation', []);

geolocation.factory('GeolocationService', function() {
  var geolocationInstance = {};
  geolocationInstance.position = false;
  geolocationInstance.getPosition = function(success, error) {
    var self = this
    if (this.position) {
      callback(this.position.coords.latitude, this.position.coords.longitude);
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getCurrentPositionSuccessCallback, getCurrentPositionErrorCallback);
      } else {
        error();
        success();
      }
    }

    /**
     * @param pos
     */
    function getCurrentPositionSuccessCallback(pos) {
      self.position = pos;
      success(self.position.coords.latitude, self.position.coords.longitude);
    }

    /**
     * @param posError
     */
    function getCurrentPositionErrorCallback(posError) {
      var message = posError.code == posError.PERMISSION_DENIED ? "Dang, geolocation is disabled." : false;
      error(message);
      success();
    }

  };
  //factory function body that constructs shinyNewServiceInstance
  return geolocationInstance;
});