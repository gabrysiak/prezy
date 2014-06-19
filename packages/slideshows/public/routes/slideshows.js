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
            .state('all slideshows', {
                url: '/slideshows',
                templateUrl: 'slideshows/views/list.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('create slideshow', {
                url: '/slideshows/create',
                templateUrl: 'slideshows/views/create.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('edit slideshow', {
                url: '/slideshows/:slideshowId/edit',
                templateUrl: 'slideshows/views/edit.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('slideshow by id', {
                url: '/slideshows/:slideshowId',
                templateUrl: 'slideshows/views/view.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('play slideshow by id', {
                url: '/slideshows/play/:slideshowId',
                templateUrl: 'slideshows/views/play.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            });
    }
]);

