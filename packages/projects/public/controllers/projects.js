'use strict';

angular.module('mean').controller('ProjectsController', ['$scope', '$stateParams', '$location', '$log', 'Global', 'Clients', 'Projects', 'Rounds', 'Concepts', 'FlashService', '$timeout',
    function($scope, $stateParams, $location, $log, Global, Clients, Projects, Rounds, Concepts, FlashService, $timeout) {
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

        $scope.findConcepts = function() {
            Projects.concepts({
                projectId: $stateParams.projectId
            }, function(concepts) {
                $scope.concepts = concepts;
                $scope.findOne();
            });
        };

        $scope.findRounds = function() {
            Projects.rounds({
                projectId: $stateParams.projectId
            }, function(rounds) {
                $scope.rounds = rounds;
                $scope.findOne();
            });
        };

        $scope.removeConcept = function(concept) {
            Concepts.delete({
                conceptId: concept._id
            }, function(concept){
                // remove concept from scope
                $scope.concepts = _.without($scope.concepts, _.findWhere($scope.concepts, {_id: concept._id}));
            });
        };
    }
]);