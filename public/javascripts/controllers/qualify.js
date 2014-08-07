var QualifyCtrl = function ($scope, $state) {
  // we will store all of our form data in this object
  $scope.formData = {};

  $scope.progress = function (nextState) {
    $state.transitionTo(nextState);
  };
};