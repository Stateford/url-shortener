app.controller('urlCtrl', ['$scope', '$http', 'url', function($scope, $http, url) {
    url.success(function(data) {
        $scope.url = data;
    })
}]);