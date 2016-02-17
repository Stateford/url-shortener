app.controller('urlCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.link = {};
    $scope.clicked = function() {
        var input = $('.original').val();
        $http.get('http://localhost:8080/new/' + input)
            .success(function(data) {
                $scope.link = data[0];
            })
            .error(function(data) {
            console.log(data);
            })
    };
}]);