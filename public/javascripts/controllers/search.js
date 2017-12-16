wicItApp.controller('SearchCtrl', function ($scope) {

  var STATE_INITIAL     = 'initial';
  var STATE_PENDING     = 'pending';
  var STATE_RESULTS     = 'results';
  var STATE_NO_RESULTS  = 'noResults';
  var STATE_ERROR       = 'error';

  var RESULTS_PER_PAGE = 25;
  var DEBOUNCE = 200;

  $scope.state = STATE_INITIAL;
  $scope.results = [];
  $scope.count = 0;
  $scope.query = '';

  var timeout = 0;

  $scope.submit = function()
  {
    if (!$scope.query) {
      $scope.state = STATE_INITIAL;
      clearTimeout(timeout);
      return;
    }

    if (!$scope.results.length) {
      $scope.state = STATE_PENDING;
    }

    var request = function ()
    {
      $.ajax('/approved-foods', {
        data: {q: $scope.query},
        dataType: 'json'
      }).done(function (data) {
        $scope.$apply(function () {
          $scope.count = data.count;
          $scope.state = data.count ? STATE_RESULTS : STATE_NO_RESULTS;
          $scope.results = data.results.slice(0, RESULTS_PER_PAGE);
        });
      }).fail(function () {
        $scope.$apply(function () {
          $scope.state = STATE_ERROR;
        });
      });
    };

    clearTimeout(timeout);
    timeout = setTimeout(request, DEBOUNCE);
  };
});
