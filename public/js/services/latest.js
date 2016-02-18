app.factory('latest', function($http) {
    return $http.get('http://localhost:8080/api/latest')
        .success(function(data) {
            return data;
        })
        .error(function(data) {
            return console.log('there was an error');
        })
});