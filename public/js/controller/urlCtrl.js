app.controller('urlCtrl', ['$scope', '$http', 'url', function($scope, $http, url) {
    $scope.clicked = function() {
        url.success(function(data) {
            $scope.link = data;
        })
    }
}]);