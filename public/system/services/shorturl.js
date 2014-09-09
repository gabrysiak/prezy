'use strict';

//Global service for global variables
angular.module('mean.system').factory('ShortUrl', ['$rootScope', '$http', '$q',
    function ($rootScope, $http, $q) {
        
        var shortUrl = function(conceptId) {
            var deferred = $q.defer();

            $http.get('/bitly/' + conceptId).then(function (response) {
                deferred.resolve(response.data.shortUrl);
            }, function (err) {
                return err;
            });

            return deferred.promise;
        };

        return {
            getBitlyUrl: function (conceptId) {
                return shortUrl(conceptId);
            }
        };
    }
]);
