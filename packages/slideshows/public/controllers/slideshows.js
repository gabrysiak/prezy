'use strict';

angular.module('mean').controller('SlideshowsController', ['$scope', '$stateParams', '$location', '$http', '$log', 'Global', 'Clients', 'Projects', 'Slideshows', 'Shorturls', 'Rounds', 'Templates', '$upload', '$sce', '$timeout',
    function($scope, $stateParams, $location, $http, $log, Global, Clients, Projects, Slideshows, Shorturls, Rounds, Templates, $upload, $sce, $timeout) {
        $scope.global = Global;
        
        // get client from query string
        var searchClient = $location.search().client;

        // initial slide values
        $scope.slides = [];
        $scope.slideDataX = 0;
        $scope.slideDataY = 0;

        // populate templates from service
        $scope.templates = Templates.all();

        // populate rounds from service
        $scope.rounds = Rounds.all();

        // initially populate the clients dropdown
        Clients.query(function(clients) {
            $scope.clients = [];
            angular.forEach(clients, function(client) {
                $scope.clients.push({
                    value: client._id,
                    text: client.title
                });
            });
            // check if client auto populated
            if (searchClient) $scope.client = searchClient;
        });

        // initially populate the projects dropdown
        Projects.query(function(projects) {
            $scope.projects = [];
            angular.forEach(projects, function(project) {
                $scope.projects.push({
                    value: project._id,
                    text: project.title
                });
            });
        });

        //Event Listener for ng-repeat on slideshow slides.This is needed because impress tries to render the cards while ng-repeat is still populating the attributes in the template.  This works alongside the initiateImpress directive
        $scope.$on('ngRepeatFinished', function() {
            $timeout(function(){
                impress().init();
            });
        });

        // owl carousel options
        $scope.carousel = {
            nav: true,
            margin:10,
            responsiveClass:true,
            responsive:{
                0:{
                    items:1,
                    nav:true
                },
                600:{
                    items:3,
                    nav:false
                },
                1000:{
                    items:5,
                    nav:true,
                    loop:false
                }
            }
        };

        // angular.js function encodeUriQuery was modified to add replace(/%2F/gi, '/'). on line 1248
        // without this the impressjs navigation carousel wont work
        $scope.carouselNav = function(id, start){
            if (start && start === true) {
                impress().goto('start');
            } else {
                impress().goto(id);
            }
        };
        // pass html to $sce service and trust it.  Make sure this is coming from source you trust
        $scope.to_trusted = function(html_code) {
            return $sce.trustAsHtml(html_code);
        };

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
                    project: this.project,
                    round: this.round,
                    shortUrl: null
                });
                slideshow.$save(function(response) {
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
                    // $location.path('slideshows/' + slideshow._id);
                    $location.path('slideshows');
                });
            } else {
                $scope.submitted = true;
            }
        };

        $scope.find = function() {
            if (!searchClient) {
                Slideshows.query(function(slideshows) {
                    $scope.slideshows = slideshows;
                    return;
                });
            }
            Clients.projects({
                clientId: searchClient
            }, function(projects) {
                $scope.projects = projects;
            });
        };

        $scope.findOne = function() {
            Slideshows.get({
                slideshowId: $stateParams.slideshowId
            }, function(slideshow) {
                $scope.$watch('clients', function(clients){
                    if (!clients) return;
                    $scope.slideshow = slideshow;
                    $scope.slides = $scope.slideshow.slides;
                }, true);
            });
        };

        $scope.updateProjects = function(client) {
            if (typeof client === 'undefined') return;
                Clients.projects({
                    clientId: client
                }, function(projects) {
                    if (projects.length === 0) {
                        $scope.slideshow.project = null;
                    }
                    $scope.projects = [];
                    angular.forEach(projects, function(project) {
                        $scope.projects.push({
                            value: project._id,
                            text: project.title
                        });
                    });
                });
        };

        $scope.duplicate = function(slideshow) {
            if (!slideshow) return;
            var slideshowDuplicate = new Slideshows({
                title: slideshow.title,
                slides: slideshow.slides,
                client: slideshow.client,
                project: slideshow.project,
                round: slideshow.round,
                shortUrl: null
            });
            slideshowDuplicate.$save(function(response) {
                $scope.createShortUrl(response._id, true, function(shortUrl){
                    response.shortUrl = shortUrl;
                    $scope.slideshows.push(response);
                });
            });
        };

        $scope.addSlide = function(slideshow) {
            // auto increment slide data x,y
            this.autoDataXY('add', function(){
                if (!slideshow) {
                    var newItemNo = $scope.slides.length+1;
                    $scope.slides.push({
                        id: newItemNo,
                        template: typeof $scope.slides.template === 'undefined' ? null : $scope.slides.template,
                        slideNumber: newItemNo,
                        content: '',
                        contentRight: '',
                        data_x: $scope.slideDataX,
                        data_y: $scope.slideDataY
                    });
                    return;
                }

                var editItemNo = slideshow.slides.length+1;
                slideshow.slides.push({
                    id: editItemNo,
                    template: typeof slideshow.slides.template === 'undefined' ? null : slideshow.slides.template,
                    slideNumber: editItemNo,
                    content: '',
                    contentRight: '',
                    data_x: $scope.slideDataX,
                    data_y: $scope.slideDataY
                });
            });
        };

        $scope.removeSlide = function(slide) {
            // after removing a slide we need to loop through
            // all slides and fix the data x,y
            var adjustData = function() {
                var dataX = 1500;
                angular.forEach($scope.slides, function(slide) {
                    slide.data_x = $scope.slideDataX = dataX;
                    dataX += 1500;
                });
            };

            // auto adjust slide data data x,y
            this.autoDataXY('remove', function(){
                // remove item from scope / model
                if ($scope.slideshow && $scope.slideshow.slides) {
                    $scope.slideshow.slides = _.filter($scope.slideshow.slides, function (slideshowSlide) {
                        return (slide.id !== slideshowSlide.id);
                    });
                    // sync up slides
                    $scope.slides = $scope.slideshow.slides;
                    // reorder slides
                    $scope.reorderSlides($scope.slideshow.slides);
                } else {
                    $scope.slides = _.filter($scope.slides, function (slideshowSlide) {
                        return (slide.id !== slideshowSlide.id);
                    });
                    // reorder slides
                    $scope.reorderSlides($scope.slides);
                }
            });

            adjustData();
        };

        $scope.duplicateSlide = function(slide) {
            if (!slide) return;
            $scope.slides.push(slide);
        };

        $scope.createShortUrl = function(slideshowId, duplicate, callback) {
            Slideshows.get({
                slideshowId: slideshowId
            }, function(slideshow) {
                $scope.slideshow = slideshow;
            });

            $http.get('/bitly/' + slideshowId).then(function (response) {
                $scope.slideshow.shortUrl = response.data.shortUrl;
                $scope.slideshow.$update(function() {
                    if (duplicate) {
                        callback($scope.slideshow.shortUrl);
                    } else {
                        // $location.path('slideshows/' + slideshowId);
                        $location.path('slideshows');
                    }
                });
            }).catch(function (response, status, headers, config) {
                $log.error(response);  //error occured
            });
        };

        $scope.reorderSlides = function(slides) {
            angular.forEach(slides, function(value,key) {
                value.id = key+1;
                value.slideNumber = key+1;
            });
        };

        $scope.autoDataXY = function(action, callback) {
            
            // action is either add or remove
            if (!action) return;
            
            // check if we are editing exisiting slideshow and get current data x,y
            var checkSlideshowDataXY = function() {
                // check current slideshow scope, then adjust data x,y value
                if ($scope.slideshow && $scope.slideshow.slides) {
                    $scope.slideDataX = $scope.slideshow.slides[$scope.slideshow.slides.length-1].data_x;
                    $scope.slideDataY = $scope.slideshow.slides[$scope.slideshow.slides.length-1].data_y;
                }
            };
            // check slide action and calculate data x,y
            switch (action) {
                case 'add': 
                    checkSlideshowDataXY();
                    $scope.slideDataX += 1500;
                    $scope.slideDataY += 0;
                    break;
                case 'remove':
                    checkSlideshowDataXY();
                    $scope.slideDataX -= 1500;
                    $scope.slideDataY += 0;
                    break;
                default:
            }

            // execute callback function if exists
            if (callback) callback();
        };
    }
]);