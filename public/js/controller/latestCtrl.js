app.controller('latestCtrl', ['$http', '$scope', 'latest', function($http, $scope, latest) {
    latest.success(function(data) {
        $scope.latest = data;
    })
}]);