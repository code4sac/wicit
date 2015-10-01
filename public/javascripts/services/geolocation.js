// Create a new module
var geolocation = angular.module('geolocation', []);

geolocation.factory('GeolocationService', function($q) {
  var CACHE_LIFETIME = 86400000; // 1 day
  var geolocationInstance = {};
  geolocationInstance.position = false;

  // Load position from localStorage if possible.
  if (window.localStorage) {
    try {
      geolocationInstance.position = JSON.parse(localStorage.getItem('position'));
    } catch (e) {
      geolocationInstance.position = false;
    }

    // Verify that cache has not expired.
    var timestamp = geolocationInstance.position ? geolocationInstance.position.timestamp : 0;
    if (Date.now() - timestamp > CACHE_LIFETIME) {
      geolocationInstance.position = false;
    }
  }

  geolocationInstance.getPosition = function(options) {
    options = options || {};
    var self = this;
    var deferred = $q.defer();
    // Check cache.
    if (this.position && !options.forceUpdate) {
      deferred.resolve(this.position);
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getCurrentPositionSuccessCallback, getCurrentPositionErrorCallback);
      } else {
        deferred.reject('Geolocation error.');
      }
    }

    return deferred.promise;

    /**
     * @param pos
     */
    function getCurrentPositionSuccessCallback(pos) {
      // Cache result;
      self.position = pos;
      deferred.resolve(self.position);

      if (window.localStorage) {
        try {
          localStorage.setItem('position', encodePosition(pos));
        } catch (e) {
          // LocalStorage may be disabled.
        }
      }
    }

    /**
     * @param posError
     */
    function getCurrentPositionErrorCallback(posError) {
      deferred.reject(posError);
    }

    /**
     * Firefox and IE9 put properties onto the Position prototype,
     *   not the object itself, which is technically correct but
     *   breaks JSON.stringify(). To get around this, manually
     *   copy the properties we're interested in.
     *
     * NOTE: Desktop Safari returns January 1, 2001 as the timestamp,
     *   so we'll use Date.now() instead. Details:
     *   http://stackoverflow.com/a/11071426
     *
     * @param pos
     */
    function encodePosition (pos) {
      return JSON.stringify({
        timestamp: Date.now(), // (see above)
        coords: {
          accuracy: pos.coords.accuracy,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        }
      });
    }
  };
  //factory function body that constructs shinyNewServiceInstance
  return geolocationInstance;
});