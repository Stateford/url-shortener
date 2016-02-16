app.factory('url', ['$http', function($http) {
    var input = $('.original').val();
    return $http.get('http://localhost:8080/new/' + input)
        .success(function(data) {
            return data;
        })
        .error(function(data) {
            return data;
        })
    
}]);