'use strict';

angular.module('mean').controller('SlideshowsController', ['$scope', '$stateParams', '$location', '$http', '$log', 'Global', 'Slideshows', 'Shorturls',
    function($scope, $stateParams, $location, $http, $log, Global, Slideshows, Shorturls) {
        $scope.global = Global;

        $scope.hasAuthorization = function(slideshow) {
            if (!slideshow || !slideshow.user) return false;
            return $scope.global.isAdmin || slideshow.user._id === $scope.global.user._id;
        };

        $scope.create = function(isValid) {
            if (isValid) {
                var slideshow = new Slideshows({
                    title: this.title,
                    slideNumber: this.slideNumber,
                    content: this.content,
                    data_x: this.data_x,
                    data_y: this.data_y,
                    shortUrl: null
                });
                slideshow.$save(function(response) {
                    // $location.path('slideshows/' + response._id);
                    $scope.createShortUrl(response._id);
                });

            } else {
                $scope.submitted = true;
            }
        };

        $scope.remove = function(slideshow) {
            if (slideshow) {
                slideshow.$remove();

                for (var i in $scope.slideshows) {
                    if ($scope.slideshows[i] === slideshow) {
                        $scope.slideshows.splice(i, 1);
                    }
                }
            } else {
                $scope.slideshow.$remove(function(response) {
                    $location.path('slideshows');
                });
            }
        };

        $scope.update = function(isValid) {
            if (isValid) {
                var slideshow = $scope.slideshow;
                // var slideshow.slides = [];
                
                if (!slideshow.updated) {
                    slideshow.updated = [];
                }
                slideshow.updated.push(new Date().getTime());

                slideshow.$update(function() {
                    $location.path('slideshows/' + slideshow._id);
                });
            } else {
                $scope.submitted = true;
            }
        };

        $scope.find = function() {
            Slideshows.query(function(slideshows) {
                $scope.slideshows = slideshows;
            });
        };

        $scope.findOne = function() {
            Slideshows.get({
                slideshowId: $stateParams.slideshowId
            }, function(slideshow) {
                $scope.slideshow = slideshow;
            });
        };

        $scope.addSlide = function() {

        };

        $scope.createShortUrl = function(slideshowId) {
            Slideshows.get({
                slideshowId: slideshowId
            }, function(slideshow) {
                $scope.slideshow = slideshow;
            });

            $http.get('/bitly/' + slideshowId).then(function (response) {
                $scope.slideshow.shortUrl = response.data.shortUrl;
                $scope.slideshow.$update(function() {
                    $location.path('slideshows/' + slideshowId);
                });
            }).catch(function (response, status, headers, config) {
                $log.error(response);  //error occured
            });
        };
    }
]);
