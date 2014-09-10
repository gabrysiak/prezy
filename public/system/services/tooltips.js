'use strict';

//Global service for global variables
angular.module('mean.system').factory('Tooltips', ['$rootScope', '$http', '$q',
    function ($rootScope, $http, $q) {        
        return {
            /**
             * Get tooltip text from JSON file
             * @param  {string} moduleName Name of particular section to fetch
             * @return {object}            Object containing tooltips
             */
            getTooltips: function(moduleName) {
                var deferred = $q.defer();

                $http.get('/public/json/tooltips.json').then(function (response) {
                    if (moduleName) {
                        moduleName = moduleName.toLowerCase();
                        deferred.resolve(response.data[moduleName]);
                    } else {
                        deferred.resolve(response.data);
                    }
                }, function (err) {
                    return err;
                });

                return deferred.promise;
            }
        };
    }
]);
