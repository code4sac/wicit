var QualifyCtrl = function ($scope, $state) {
  $scope.family = {};

  // we will store all of our form data in this object
  $scope.periods = [
    { label: 'week', value: 52 },
    { label: 'month', value: 12 },
    { label: 'year', value: 1 }
  ];

  $scope.submit = function()
  {
    var yearlyIncome = $scope.family.income * $scope.family.payperiod;
    var threshold = 21590 + 7511 * $scope.family.count;
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
    $state.transitionTo('qualify.result');
  };

  $scope.next = function (nextState, data)
  {
    $state.transitionTo(nextState);
  };
};