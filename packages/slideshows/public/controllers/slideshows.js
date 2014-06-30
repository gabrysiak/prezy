'use strict';

angular.module('mean').controller('SlideshowsController', ['$scope', '$stateParams', '$location', '$http', '$log', 'Global', 'Clients', 'Slideshows', 'Shorturls',
    function($scope, $stateParams, $location, $http, $log, Global, Clients, Slideshows, Shorturls) {
        $scope.global = Global;

        $scope.slides = [{
            id: 1,
            slideNumber: 1,
            content: null,
            data_x: null,
            data_y: null
        }];

        // populate the clients dropdown
        Clients.query(function(clients) {
            $scope.clients = [];
            angular.forEach(clients, function(client) {
                $scope.clients.push({
                    value: client._id,
                    text: client.title
                });
            });
        });

        $scope.hasAuthorization = function(slideshow) {
            if (!slideshow || !slideshow.user) return false;
            return $scope.global.isAdmin || slideshow.user._id === $scope.global.user._id;
        };

        $scope.create = function(isValid) {
            if (isValid) {
                this.slides = $scope.slides;

                var slideshow = new Slideshows({
                    title: this.title,
                    slides: this.slides,
                    client: this.client,
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
                $scope.$watch('clients', function(clients){
                    if (!clients) return;
                    $scope.slideshow = slideshow;
                }, true);
            });
        };

        $scope.addSlide = function(slideshow) {
            if( !slideshow ) {
                var newItemNo = $scope.slides.length+1;
                $scope.slides.push({
                    id: newItemNo,
                    slideNumber: newItemNo,
                    content: null,
                    data_x: null,
                    data_y: null
                });
                return;
            } else {
                var editItemNo = slideshow.slides.length+1;
                slideshow.slides.push({
                    id: editItemNo,
                    slideNumber: editItemNo,
                    content: null,
                    data_x: null,
                    data_y: null
                });
            }
        };

        $scope.removeSlide = function(slide) {
            // remove item from scope / model
            $scope.slideshow.slides = _.filter($scope.slideshow.slides, function (slideshowSlide) {
              return (slide.id !== slideshowSlide.id);
            });
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