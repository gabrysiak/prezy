'use strict';

angular.module('mean').controller('RoundsController', ['$scope', '$rootScope', '$stateParams', '$location', '$log', 'Global', 'DefaultRounds', 'Rounds', 'Clients', 'Projects', 'Concepts', 'ClientProjects', 'ShortUrl', 'FlashService', '$timeout',
    function($scope, $rootScope, $stateParams, $location, $log, Global, DefaultRounds, Rounds, Clients, Projects, Concepts, ClientProjects, ShortUrl, FlashService, $timeout) {
        $scope.global = Global;

        // get client from qu;ery string
        var searchClient = $location.search().clientId;
        // get project from query string
        var searchProject = $location.search().projectId || $stateParams.projectId;

        $scope.rounds = DefaultRounds.all();

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

        $scope.hasAuthorization = function(round) {
            if (!round || !round.user) return false;
            return $scope.global.isAdmin || round.user._id === $scope.global.user._id;
        };

        $scope.create = function(isValid) {
            if (isValid) {
                var round = new Rounds({
                    title: this.title,
                    content: this.content,
                    round: this.round,
                    client: this.client,
                    project: this.project
                });
                round.$save(function(response) {
                    $location.path('rounds');
                });

            } else {
                $scope.submitted = true;
            }
        };

        $scope.remove = function(round) {
            if (round) {
                round.$remove();

                for (var i in $scope.rounds) {
                    if ($scope.rounds[i] === round) {
                        $scope.rounds.splice(i, 1);
                    }
                }
            } else {
                $scope.round.$remove(function(response) {
                    $location.path('rounds');
                });
            }
        };

        $scope.update = function(isValid) {
            if (isValid) {
                var round = $scope.round;

                round.$update(function() {
                    // $location.path('rounds/' + round._id);
                    window.location.href = $rootScope.referrerUrl;
                });
            } else {
                $scope.submitted = true;
            }
        };

        $scope.find = function() {
            Rounds.query(function(rounds) {         
                $scope.rounds = rounds;
            });
        };


        $scope.findOne = function() {
            Rounds.get({
                roundId: $stateParams.roundId
            }, function(round) {
                $scope.$watch('clients', function(clients){
                    if (!clients) return;
                    $scope.round = round;
                }, true);
            });
        };

        $scope.updateProjects = function(clientId) {
            ClientProjects.populateDropdown(clientId)
                .then(function(dropdown) {
                    $scope.projects = dropdown;
                }, function (err) {
                    console.log(err);
                });
        };

        $scope.findConcepts = function() {
            Rounds.concepts({
                roundId: $stateParams.roundId,
                clientId: searchClient,
                projectId: searchProject
            }, function(concepts) {
                $scope.concepts = concepts;
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