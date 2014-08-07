var QualifyCtrl = function ($scope, $state) {
  // we will store all of our form data in this object
  $scope.formData = {};

  $scope.result = function(success, reason) {
    $scope.success = success;
    $scope.reason = reason ? reason : false;
    $state.transitionTo('qualify.result');
  };

  $scope.next = function (nextState, data) {
    $state.transitionTo(nextState);
  };
};