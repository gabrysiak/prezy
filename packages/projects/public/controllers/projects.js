'use strict';

angular.module('mean').controller('ProjectsController', ['$scope', '$stateParams', '$location', '$log', 'Global', 'Clients', 'Projects', 'Slideshows', 'FlashService', '$timeout',
    function($scope, $stateParams, $location, $log, Global, Clients, Projects, Slideshows, FlashService, $timeout) {
        $scope.global = Global;

        // get client from query string
        var searchClient = $location.search().client;

        // populate the clients dropdown
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

        $scope.hasAuthorization = function(project) {
            if (!project || !project.user) return false;
            return $scope.global.isAdmin || project.user._id === $scope.global.user._id;
        };

        $scope.create = function(isValid) {
            if (isValid) {
                var project = new Projects({
                    title: this.title,
                    content: this.content,
                    client: this.client
                });
                project.$save(function(response) {
                    $location.path('projects');
                });

            } else {
                $scope.submitted = true;
            }
        };

        $scope.remove = function(project) {
            if (project) {
                project.$remove();

                for (var i in $scope.projects) {
                    if ($scope.projects[i] === project) {
                        $scope.projects.splice(i, 1);
                    }
                }
            } else {
                $scope.project.$remove(function(response) {
                    $location.path('projects');
                });
            }
        };

        $scope.update = function(isValid) {
            if (isValid) {
                var project = $scope.project;
  
                if (!project.updated) {
                    project.updated = [];
                }
                project.updated.push(new Date().getTime());

                project.$update(function() {
                    // $location.path('projects/' + project._id);
                    $location.path('projects');
                });
            } else {
                $scope.submitted = true;
            }
        };

        $scope.find = function() {
            if (!searchClient) {
                Projects.query(function(projects) {         
                    $scope.projects = projects;
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
            Projects.get({
                projectId: $stateParams.projectId
            }, function(project) {
                $scope.$watch('clients', function(clients){
                    if (!clients) return;
                    $scope.project = project;
                }, true);
            });
        };

        $scope.findSlideshows = function() {
            Projects.slideshows({
                projectId: $stateParams.projectId
            }, function(slideshows) {
                $scope.slideshows = slideshows;
                $scope.findOne();
            });
        };

        $scope.removeSlideshow = function(slideshow) {
            Slideshows.delete({
                slideshowId: slideshow._id
            }, function(slideshow){
                // remove slideshow from scope
                $scope.slideshows = _.without($scope.slideshows, _.findWhere($scope.slideshows, {_id: slideshow._id}));
            });
        };
    }
]);