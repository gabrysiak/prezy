'use strict';

//Setting up route
angular.module('mean').config(['$stateProvider',
    function($stateProvider) {
        // Check if the user is connected
        var checkLoggedin = function($q, $timeout, $http, $location) {
            // Initialize a new promise
            var deferred = $q.defer();

            // Make an AJAX call to check if the user is logged in
            $http.get('/loggedin').success(function(user) {
                // Authenticated
                if (user !== '0') $timeout(deferred.resolve);

                // Not Authenticated
                else {
                    $timeout(deferred.reject);
                    $location.url('/login');
                }
            });

            return deferred.promise;
        };

        // states for my app
        $stateProvider
            .state('all rounds', {
                url: '/rounds',
                templateUrl: 'rounds/views/list.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('create round', {
                url: '/rounds/create',
                templateUrl: 'rounds/views/create.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('edit round', {
                url: '/rounds/:roundId/edit',
                templateUrl: 'rounds/views/edit.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('round by id', {
                url: '/rounds/:roundId',
                templateUrl: 'rounds/views/view.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('round concepts', {
                url: '/rounds/:roundId/concepts',
                templateUrl: 'rounds/views/concepts.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            });
    }
]);

