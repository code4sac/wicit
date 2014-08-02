// Create a new module
var notificationsModule = angular.module('notifications', []);

notificationsModule.factory('NotificationService', function($rootScope, $timeout) {
  var notificationInstance = {};
  var notifications = {};

  notificationInstance.STATUSES = {
    INFO: {
      class: 'info',
      duration: 5000
    },
    IMPORTANT: {
      class: 'important',
      duration: 10000
    },
    SUCCESS: {
      class: 'success',
      duration: 3000
    },
    WARNING: {
      class: 'warning',
      duration: 5000
    },
    ERROR: {
      class: 'error',
      duration: 10000
    }
  };

  /**
   * TODO: Only fires $timeout for first notification.
   * @param notification
   */
  notificationInstance.addNotificiation = function(notification)
  {
    var key = Object.keys(notifications).length;
    notifications[key] = notification;
    $rootScope.notifications = notifications;
    $rootScope.$broadcast('newNotification');
    $timeout(function() {
      delete notifications[key];
      $rootScope.notifications = notifications;
    }, notification.status.duration);
  };

  return notificationInstance;
});