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
            .state('all clients', {
                url: '/clients',
                templateUrl: 'clients/views/list.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('create client', {
                url: '/clients/create',
                templateUrl: 'clients/views/create.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('edit client', {
                url: '/clients/:clientId/edit',
                templateUrl: 'clients/views/edit.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('client by id', {
                url: '/clients/:clientId',
                templateUrl: 'clients/views/view.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('client concepts', {
                url: '/clients/:clientId/concepts',
                templateUrl: 'clients/views/concepts.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('client projects', {
                url: '/clients/:clientId/projects',
                templateUrl: 'clients/views/projects.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            });
    }
]);

