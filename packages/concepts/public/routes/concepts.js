'use strict';

//Setting up route
angular.module('mean').config(['$stateProvider',
    function($stateProvider) {
        // Check if the user is connected
        var checkLoggedin = function($q, $timeout, $http, $location, $window) {
            // Initialize a new promise
            var deferred = $q.defer(),
                protect = $location.search().key; // get key param to check if protected concept

            // if key doesnt exist check if user logged in
            if (!protect) {
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
            }
            // Protected route, redirect to verify key
            $window.location = 'http://prezy.ycproduction1.com:3000/public/play?key=testing';
        };

        // states for my app
        $stateProvider
            .state('all concepts', {
                url: '/concepts',
                templateUrl: 'concepts/views/list.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('create concept', {
                url: '/concepts/create',
                templateUrl: 'concepts/views/create.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('edit concept', {
                url: '/concepts/:conceptId/edit',
                templateUrl: 'concepts/views/edit.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('concept by id', {
                url: '/concepts/:conceptId',
                templateUrl: 'concepts/views/view.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('play concept by id', {
                url: '/concepts/play/:conceptId',
                templateUrl: 'concepts/views/play.html',
                resolve: {
                    // voicloggedin: checkLoggedin
                }
            });
    }
]);

