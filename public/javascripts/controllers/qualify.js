wicItApp.controller('QualifyCtrl', function ($scope, $state, NotificationService) {
  $scope.family = {};

  // we will store all of our form data in this object
  $scope.periods = [
    { label: 'year', value: 1 },
    { label: 'month', value: 12 },
    { label: 'week', value: 52 },
  ];

  $scope.submit = function()
  {
    var error = false;
    if ( ! $scope.family.income || ! parseFloat($scope.family.income)) {
      NotificationService.addNotificiation({
        message: "Please enter your income.",
        status: NotificationService.STATUSES.ERROR
      });
      error = true;
    }
    if (! $scope.family.count || ! parseInt($scope.family.count)) {
      NotificationService.addNotificiation({
        message: "Please enter the number of people in your family.",
        status: NotificationService.STATUSES.ERROR
      });
      error = true;
    }
    if (error) {
      return false;
    }
    var yearlyIncome = $scope.family.income * $scope.family.payperiod;
    var threshold = 21590 + 7511 * $scope.family.count;
    console.log(yearlyIncome);
    console.log(threshold);
    if (yearlyIncome > threshold) {
      $scope.result(false, 'income');
    } else {
      $scope.result(true);
    }
  }

  $scope.result = function(success, reason)
  {
    $scope.success = success;
    $scope.reason = reason ? reason : false;
    $state.transitionTo('qualify.result', { success: success, reason: reason });
  };

  $scope.next = function (nextState, data)
  {
    $state.transitionTo(nextState);
  };
});