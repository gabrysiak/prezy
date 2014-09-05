'use strict';

angular.module('mean').controller('ConceptsController', ['$scope', '$stateParams', '$location', '$http', '$log', 'Global', 'Clients', 'Projects', 'Concepts', 'Shorturls', 'Rounds', 'Templates', '$upload', '$sce', '$timeout',
    function($scope, $stateParams, $location, $http, $log, Global, Clients, Projects, Concepts, Shorturls, Rounds, Templates, $upload, $sce, $timeout) {
        $scope.global = Global;
        
        // get client from query string
        var searchClient = $location.search().clientId;
        // get project from query string
        var searchProject = $location.search().projectId;

        // initial slide values
        $scope.slides = [];
        $scope.slideDataX = 0;
        $scope.slideDataY = 0;

        // populate templates from service
        $scope.templates = Templates.all();

        // populate rounds from service
        Rounds.query(function(rounds) {
            $scope.rounds = [];
            angular.forEach(rounds, function(round) {
                $scope.rounds.push({ text: round.title, value: round._id });
            });
            console.log($scope.rounds);
        });

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
            // check if client auto populated
            if (searchProject) $scope.project = searchProject;
        });

        //Event Listener for ng-repeat on concept slides.This is needed because impress tries to render the cards while ng-repeat is still populating the attributes in the template.  This works alongside the initiateImpress directive
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

        $scope.hasAuthorization = function(concept) {
            if (!concept || !concept.user) return false;
            return $scope.global.isAdmin || concept.user._id === $scope.global.user._id;
        };

        $scope.create = function(isValid) {
            if (isValid) {
                this.slides = $scope.slides;

                var concept = new Concepts({
                    title: this.title,
                    slides: this.slides,
                    client: this.client,
                    project: this.project,
                    round: this.round,
                    shortUrl: null
                });
                concept.$save(function(response) {
                    $scope.createShortUrl(response._id);
                });

            } else {
                $scope.submitted = true;
            }
        };

        $scope.remove = function(concept) {
            if (concept) {
                concept.$remove();

                for (var i in $scope.concepts) {
                    if ($scope.concepts[i] === concept) {
                        $scope.concepts.splice(i, 1);
                    }
                }
            } else {
                $scope.concept.$remove(function(response) {
                    $location.path('concepts');
                });
            }
        };

        $scope.update = function(isValid) {
            if (isValid) {
                var concept = $scope.concept;

                concept.$update(function() {
                    // $location.path('concepts/' + concept._id);
                    $location.path('concepts');
                });
            } else {
                $scope.submitted = true;
            }
        };

        $scope.find = function() {
            Concepts.query(function(concepts) {
                $scope.concepts = concepts;
            });
        };

        $scope.findOne = function() {
            Concepts.get({
                conceptId: $stateParams.conceptId
            }, function(concept) {
                $scope.$watch('clients', function(clients){
                    if (!clients) return;
                    $scope.concept = concept;
                    $scope.slides = $scope.concept.slides;
                }, true);
            });
        };

        $scope.updateProjects = function(client) {
            if (typeof client === 'undefined') return;
                Clients.projects({
                    clientId: client
                }, function(projects) {
                    if (projects.length === 0) {
                        $scope.concept.project = null;
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

        $scope.duplicate = function(concept) {
            if (!concept) return;
            var conceptDuplicate = new Concepts({
                title: concept.title,
                slides: concept.slides,
                client: concept.client,
                project: concept.project,
                round: concept.round,
                shortUrl: null
            });
            conceptDuplicate.$save(function(response) {
                $scope.createShortUrl(response._id, true, function(shortUrl){
                    response.shortUrl = shortUrl;
                    $scope.concepts.push(response);
                });
            });
        };

        $scope.addSlide = function(concept) {
            // auto increment slide data x,y
            this.autoDataXY('add', function(){
                if (!concept) {
                    var newItemNo = $scope.slides.length+1;
                    $scope.slides.push({
                        id: newItemNo,
                        template: typeof $scope.slides.template === 'undefined' ? null : $scope.slides.template,
                        slideNumber: newItemNo,
                        content: '',
                        contentRight: '',
                        dataX: $scope.slideDataX,
                        dataY: $scope.slideDataY
                    });
                    return;
                }

                var editItemNo = concept.slides.length+1;
                concept.slides.push({
                    id: editItemNo,
                    template: typeof concept.slides.template === 'undefined' ? null : concept.slides.template,
                    slideNumber: editItemNo,
                    content: '',
                    contentRight: '',
                    dataX: $scope.slideDataX,
                    dataY: $scope.slideDataY
                });
            });
        };

        $scope.removeSlide = function(slide) {
            // after removing a slide we need to loop through
            // all slides and fix the data x,y
            var adjustData = function() {
                var dataX = 1500;
                angular.forEach($scope.slides, function(slide) {
                    slide.dataX = $scope.slideDataX = dataX;
                    dataX += 1500;
                });
            };

            // auto adjust slide data data x,y
            this.autoDataXY('remove', function(){
                // remove item from scope / model
                if ($scope.concept && $scope.concept.slides) {
                    $scope.concept.slides = _.filter($scope.concept.slides, function (conceptSlide) {
                        return (slide._id !== conceptSlide._id);
                    });
                    // sync up slides
                    $scope.slides = $scope.concept.slides;
                    // reorder slides
                    $scope.reorderSlides($scope.concept.slides);
                } else {
                    $scope.slides = _.filter($scope.slides, function (conceptSlide) {
                        return (slide._id !== conceptSlide._id);
                    });
                    // reorder slides
                    $scope.reorderSlides($scope.slides);
                }
            });

            adjustData();
        };

        $scope.duplicateSlide = function(concept, slide) {
            if (!slide) return;
            // auto increment slide data x,y
            this.autoDataXY('add', function(){
                if (!concept) {
                    var newItemNo = this.incrementSlideId($scope.slides, function(maxId) {
                        return maxId + 1;
                    });
                    $scope.slides.push({
                        id: newItemNo,
                        template: slide.template,
                        slideNumber: newItemNo,
                        content: slide.content,
                        contentRight: slide.contentRight,
                        dataX: $scope.slideDataX,
                        dataY: $scope.slideDataY
                    });
                    return;
                }

                var editItemNo = this.incrementSlideId(concept.slides, function(maxId) {
                    return maxId + 1;
                });
                concept.slides.push({
                    id: editItemNo,
                    template: slide.template,
                    slideNumber: editItemNo,
                    content: slide.content,
                    contentRight: slide.contentRight,
                    dataX: $scope.slideDataX,
                    dataY: $scope.slideDataY
                });
            });
        };

        $scope.createShortUrl = function(conceptId, duplicate, callback) {
            Concepts.get({
                conceptId: conceptId
            }, function(concept) {
                $scope.concept = concept;
            });

            $http.get('/bitly/' + conceptId).then(function (response) {
                $scope.concept.shortUrl = response.data.shortUrl;
                $scope.concept.$update(function() {
                    if (duplicate) {
                        callback($scope.concept.shortUrl);
                    } else {
                        // $location.path('concepts/' + conceptId);
                        $location.path('concepts');
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
            
            // check if we are editing exisiting concept and get current data x,y
            var checkConceptDataXY = function() {
                // check current concept scope, then adjust data x,y value
                if ($scope.concept && $scope.concept.slides) {
                    $scope.slideDataX = $scope.concept.slides[$scope.concept.slides.length-1].dataX;
                    $scope.slideDataY = $scope.concept.slides[$scope.concept.slides.length-1].dataY;
                }
            };
            // check slide action and calculate data x,y
            switch (action) {
                case 'add': 
                    checkConceptDataXY();
                    $scope.slideDataX += 1500;
                    $scope.slideDataY += 0;
                    break;
                case 'remove':
                    checkConceptDataXY();
                    $scope.slideDataX -= 1500;
                    $scope.slideDataY += 0;
                    break;
                default:
            }

            // execute callback function if exists
            if (callback) callback();
        };

        $scope.incrementSlideId = function(slides, callback) {

            if (!slides) return;

            // create array of ids from slides
            var nums = _.pluck(slides, 'id');
            
            // get max id from array
            var maxId = _.max(nums, function(item) {
                return item;
            });

            callback(maxId);
        };
    }
]);