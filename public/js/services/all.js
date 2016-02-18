app.factory('all', ['$http', function($http) {
    return $http.get('http://localhost:8080/api/all')
        .success(function(data) {
            return data;
        })
        .error(function(data) {
            return data;
        });
}]);