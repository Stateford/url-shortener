app.controller('allCtrl', ['$scope', 'all', function($scope, all){
    all.success(function(data) {
        $scope.all = data;
    });
}]);